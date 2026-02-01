require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Data Layer ─────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
  return fallback;
}

function saveJSON(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadNotes() { return loadJSON(NOTES_FILE, []); }
function saveNotes(notes) { saveJSON(NOTES_FILE, notes); }
function loadSettings() {
  return loadJSON(SETTINGS_FILE, {
    slackSyncEnabled: !!process.env.SLACK_USER_TOKEN,
    granolaSyncEnabled: !!(process.env.GRANOLA_ACCESS_TOKEN || process.env.GRANOLA_AUTO_DETECT === 'true'),
    appleNotesSyncEnabled: !!process.env.APPLE_NOTES_WEBHOOK_SECRET,
  });
}
function saveSettings(s) { saveJSON(SETTINGS_FILE, s); }

function generateId() { return crypto.randomUUID(); }

// ─── Sync State ─────────────────────────────────────────────────────────────
const syncState = {
  slack:      { lastSync: null, status: 'idle', error: null, noteCount: 0 },
  granola:    { lastSync: null, status: 'idle', error: null, noteCount: 0 },
  appleNotes: { lastSync: null, status: 'idle', error: null, noteCount: 0 },
};

// ─── Slack Integration ──────────────────────────────────────────────────────
class SlackSync {
  constructor() {
    this.token = process.env.SLACK_USER_TOKEN;
    this.baseUrl = 'https://slack.com/api';
    this.watchChannels = (process.env.SLACK_WATCH_CHANNELS || '').split(',').map(c => c.trim()).filter(Boolean);
    this.selfUserId = null;
  }

  get enabled() { return !!this.token; }

  async api(method, params = {}) {
    const url = new URL(`${this.baseUrl}/${method}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${this.token}` },
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`Slack API ${method}: ${data.error}`);
    return data;
  }

  async getSelfUserId() {
    if (this.selfUserId) return this.selfUserId;
    const data = await this.api('auth.test');
    this.selfUserId = data.user_id;
    return this.selfUserId;
  }

  async fetchStarredItems() {
    const notes = [];
    try {
      const data = await this.api('stars.list', { limit: 100 });
      for (const item of (data.items || [])) {
        if (item.type === 'message' && item.message) {
          notes.push({
            sourceId: `slack-star-${item.message.ts}-${item.channel}`,
            title: this.extractTitle(item.message.text),
            content: item.message.text || '',
            source: 'slack',
            sourceUrl: '',
            sourceMeta: {
              type: 'starred',
              channel: item.channel,
              ts: item.message.ts,
              user: item.message.user,
            },
          });
        }
      }
    } catch (e) {
      console.error('Slack stars.list error:', e.message);
    }
    return notes;
  }

  async fetchSelfDMs() {
    const notes = [];
    try {
      const userId = await this.getSelfUserId();
      const convos = await this.api('conversations.list', { types: 'im', limit: 200 });
      const selfDM = (convos.channels || []).find(c => c.user === userId);
      if (!selfDM) return notes;

      const oldest = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000); // last 30 days
      const history = await this.api('conversations.history', {
        channel: selfDM.id,
        limit: 200,
        oldest: oldest.toString(),
      });

      for (const msg of (history.messages || [])) {
        if (msg.subtype) continue; // skip system messages
        notes.push({
          sourceId: `slack-self-${msg.ts}`,
          title: this.extractTitle(msg.text),
          content: msg.text || '',
          source: 'slack',
          sourceUrl: '',
          sourceMeta: {
            type: 'self-dm',
            channel: selfDM.id,
            ts: msg.ts,
          },
        });
      }
    } catch (e) {
      console.error('Slack self-DM error:', e.message);
    }
    return notes;
  }

  async fetchWatchedChannels() {
    const notes = [];
    if (this.watchChannels.length === 0) return notes;

    try {
      const convos = await this.api('conversations.list', { types: 'public_channel,private_channel', limit: 500 });
      const channelMap = {};
      for (const ch of (convos.channels || [])) {
        channelMap[ch.name] = ch.id;
      }

      const oldest = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000); // last 7 days
      for (const name of this.watchChannels) {
        const channelId = channelMap[name];
        if (!channelId) continue;
        try {
          const history = await this.api('conversations.history', {
            channel: channelId,
            limit: 50,
            oldest: oldest.toString(),
          });
          for (const msg of (history.messages || [])) {
            if (msg.subtype) continue;
            notes.push({
              sourceId: `slack-ch-${channelId}-${msg.ts}`,
              title: this.extractTitle(msg.text),
              content: msg.text || '',
              source: 'slack',
              sourceUrl: '',
              sourceMeta: {
                type: 'channel',
                channelName: name,
                channel: channelId,
                ts: msg.ts,
              },
            });
          }
        } catch (e) {
          console.error(`Slack channel ${name} error:`, e.message);
        }
      }
    } catch (e) {
      console.error('Slack channels error:', e.message);
    }
    return notes;
  }

  extractTitle(text) {
    if (!text) return 'Untitled';
    const firstLine = text.split('\n')[0].replace(/<[^>]+>/g, '').trim();
    return firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine || 'Untitled';
  }

  async sync() {
    if (!this.enabled) return;
    syncState.slack.status = 'syncing';
    try {
      const [starred, selfDMs, watched] = await Promise.all([
        this.fetchStarredItems(),
        this.fetchSelfDMs(),
        this.fetchWatchedChannels(),
      ]);

      const allSlackNotes = [...starred, ...selfDMs, ...watched];
      const notes = loadNotes();
      let added = 0;

      for (const sn of allSlackNotes) {
        const exists = notes.find(n => n.sourceId === sn.sourceId);
        if (!exists) {
          notes.push({
            id: generateId(),
            ...sn,
            tags: [],
            folder: 'Inbox',
            starred: false,
            createdAt: sn.sourceMeta.ts
              ? new Date(parseFloat(sn.sourceMeta.ts) * 1000).toISOString()
              : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            syncedAt: new Date().toISOString(),
          });
          added++;
        }
      }

      if (added > 0) saveNotes(notes);
      syncState.slack.noteCount = allSlackNotes.length;
      syncState.slack.lastSync = new Date().toISOString();
      syncState.slack.status = 'idle';
      syncState.slack.error = null;
      console.log(`[Slack] Synced: ${added} new notes (${allSlackNotes.length} total from source)`);
    } catch (e) {
      syncState.slack.status = 'error';
      syncState.slack.error = e.message;
      console.error('[Slack] Sync error:', e.message);
    }
  }
}

// ─── Granola Integration ────────────────────────────────────────────────────
class GranolaSync {
  constructor() {
    this.accessToken = process.env.GRANOLA_ACCESS_TOKEN || null;
    this.refreshToken = process.env.GRANOLA_REFRESH_TOKEN || null;
    this.autoDetect = process.env.GRANOLA_AUTO_DETECT === 'true';
    this.apiBase = 'https://api.granola.ai';
    this.tokenExpiresAt = 0;
  }

  get enabled() { return !!(this.accessToken || this.autoDetect); }

  tryAutoDetect() {
    if (!this.autoDetect) return;
    const homeDir = os.homedir();
    const paths = [
      path.join(homeDir, 'Library', 'Application Support', 'Granola', 'supabase.json'),
      path.join(homeDir, 'AppData', 'Roaming', 'Granola', 'supabase.json'),
    ];
    for (const p of paths) {
      try {
        if (fs.existsSync(p)) {
          const data = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (data.access_token) this.accessToken = data.access_token;
          if (data.refresh_token) this.refreshToken = data.refresh_token;
          if (data.expires_at) this.tokenExpiresAt = data.expires_at * 1000;
          console.log('[Granola] Auto-detected credentials from', p);
          return;
        }
      } catch (e) {
        // skip
      }
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return;
    try {
      const res = await fetch('https://api.workos.com/user_management/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: 'client_01JABY26N2FJ5K6P9F9GBM6BAN', // Granola's WorkOS client ID
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
        if (data.refresh_token) this.refreshToken = data.refresh_token;
      }
    } catch (e) {
      console.error('[Granola] Token refresh error:', e.message);
    }
  }

  async ensureToken() {
    if (Date.now() >= this.tokenExpiresAt - 60000) {
      this.tryAutoDetect();
      if (this.refreshToken) await this.refreshAccessToken();
    }
  }

  async fetchDocuments() {
    await this.ensureToken();
    if (!this.accessToken) throw new Error('No Granola access token available');

    const res = await fetch(`${this.apiBase}/v2/get-documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'UnifiedNotes/1.0',
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) throw new Error(`Granola API error: ${res.status}`);
    const data = await res.json();
    return data.documents || data || [];
  }

  async sync() {
    if (!this.enabled) return;
    syncState.granola.status = 'syncing';
    try {
      this.tryAutoDetect();
      const documents = await this.fetchDocuments();
      const notes = loadNotes();
      let added = 0;

      for (const doc of documents) {
        const sourceId = `granola-${doc.id}`;
        const existing = notes.find(n => n.sourceId === sourceId);

        if (!existing) {
          notes.push({
            id: generateId(),
            sourceId,
            title: doc.title || 'Meeting Note',
            content: doc.notes || doc.enhanced_notes || doc.content || '',
            source: 'granola',
            sourceUrl: `https://app.granola.ai/docs/${doc.id}`,
            sourceMeta: {
              meetingTitle: doc.title,
              participants: doc.people || doc.participants || [],
              duration: doc.duration,
              meetingDate: doc.created_at || doc.start_time,
            },
            tags: ['meeting'],
            folder: 'Meetings',
            starred: false,
            createdAt: doc.created_at || new Date().toISOString(),
            updatedAt: doc.updated_at || new Date().toISOString(),
            syncedAt: new Date().toISOString(),
          });
          added++;
        } else if (doc.updated_at && doc.updated_at > existing.updatedAt) {
          existing.title = doc.title || existing.title;
          existing.content = doc.notes || doc.enhanced_notes || doc.content || existing.content;
          existing.updatedAt = doc.updated_at;
          existing.syncedAt = new Date().toISOString();
        }
      }

      if (added > 0) saveNotes(notes);
      syncState.granola.noteCount = documents.length;
      syncState.granola.lastSync = new Date().toISOString();
      syncState.granola.status = 'idle';
      syncState.granola.error = null;
      console.log(`[Granola] Synced: ${added} new notes (${documents.length} total from source)`);
    } catch (e) {
      syncState.granola.status = 'error';
      syncState.granola.error = e.message;
      console.error('[Granola] Sync error:', e.message);
    }
  }
}

// ─── Apple Notes Webhook Receiver ───────────────────────────────────────────
const appleNotesSecret = process.env.APPLE_NOTES_WEBHOOK_SECRET || '';

function handleAppleNotesWebhook(body) {
  const notes = loadNotes();
  const incoming = Array.isArray(body.notes) ? body.notes : [body];
  let added = 0;

  for (const note of incoming) {
    const sourceId = `apple-${note.id || note.title || crypto.createHash('md5').update(note.title + note.content).digest('hex')}`;
    const existing = notes.find(n => n.sourceId === sourceId);

    if (!existing) {
      notes.push({
        id: generateId(),
        sourceId,
        title: note.title || 'Untitled Note',
        content: note.content || note.body || '',
        source: 'apple-notes',
        sourceUrl: '',
        sourceMeta: {
          folder: note.folder || 'Notes',
          account: note.account || '',
          modifiedAt: note.modifiedAt || '',
        },
        tags: [],
        folder: note.folder || 'Inbox',
        starred: false,
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: note.modifiedAt || new Date().toISOString(),
        syncedAt: new Date().toISOString(),
      });
      added++;
    } else {
      const newContent = note.content || note.body || '';
      if (newContent && newContent !== existing.content) {
        existing.content = newContent;
        existing.updatedAt = note.modifiedAt || new Date().toISOString();
        existing.syncedAt = new Date().toISOString();
      }
    }
  }

  if (added > 0) saveNotes(notes);
  syncState.appleNotes.noteCount += added;
  syncState.appleNotes.lastSync = new Date().toISOString();
  syncState.appleNotes.status = 'idle';
  console.log(`[Apple Notes] Received: ${added} new notes`);
  return { added, total: incoming.length };
}

// ─── Initialize Sync Services ───────────────────────────────────────────────
const slackSync = new SlackSync();
const granolaSync = new GranolaSync();

// ─── API Routes ─────────────────────────────────────────────────────────────

// Get all notes with optional filtering
app.get('/api/notes', (req, res) => {
  let notes = loadNotes();
  const { source, folder, tag, search, starred, sort } = req.query;

  if (source) notes = notes.filter(n => n.source === source);
  if (folder) notes = notes.filter(n => n.folder === folder);
  if (tag) notes = notes.filter(n => n.tags.includes(tag));
  if (starred === 'true') notes = notes.filter(n => n.starred);
  if (search) {
    const q = search.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort
  const sortField = sort || '-updatedAt';
  const desc = sortField.startsWith('-');
  const field = desc ? sortField.slice(1) : sortField;
  notes.sort((a, b) => {
    const av = a[field] || '';
    const bv = b[field] || '';
    return desc ? bv.localeCompare(av) : av.localeCompare(bv);
  });

  res.json({ notes, count: notes.length });
});

// Get single note
app.get('/api/notes/:id', (req, res) => {
  const notes = loadNotes();
  const note = notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Create manual note
app.post('/api/notes', (req, res) => {
  const { title, content, tags, folder } = req.body;
  const note = {
    id: generateId(),
    sourceId: `manual-${generateId()}`,
    title: title || 'Untitled',
    content: content || '',
    source: 'manual',
    sourceUrl: '',
    sourceMeta: {},
    tags: tags || [],
    folder: folder || 'Inbox',
    starred: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncedAt: new Date().toISOString(),
  };
  const notes = loadNotes();
  notes.push(note);
  saveNotes(notes);
  res.status(201).json(note);
});

// Update note
app.put('/api/notes/:id', (req, res) => {
  const notes = loadNotes();
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  const allowed = ['title', 'content', 'tags', 'folder', 'starred'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) notes[idx][key] = req.body[key];
  }
  notes[idx].updatedAt = new Date().toISOString();
  saveNotes(notes);
  res.json(notes[idx]);
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  let notes = loadNotes();
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes.splice(idx, 1);
  saveNotes(notes);
  res.json({ success: true });
});

// Sync status
app.get('/api/sync/status', (req, res) => {
  res.json({
    slack: { ...syncState.slack, enabled: slackSync.enabled },
    granola: { ...syncState.granola, enabled: granolaSync.enabled },
    appleNotes: { ...syncState.appleNotes, enabled: !!appleNotesSecret },
  });
});

// Trigger manual sync
app.post('/api/sync', async (req, res) => {
  const { source } = req.body;
  try {
    if (!source || source === 'all') {
      await Promise.allSettled([slackSync.sync(), granolaSync.sync()]);
    } else if (source === 'slack') {
      await slackSync.sync();
    } else if (source === 'granola') {
      await granolaSync.sync();
    }
    res.json({ success: true, syncState });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Apple Notes webhook
app.post('/api/webhook/apple-notes', (req, res) => {
  const secret = req.headers['x-webhook-secret'] || req.query.secret;
  if (appleNotesSecret && secret !== appleNotesSecret) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }
  const result = handleAppleNotesWebhook(req.body);
  res.json({ success: true, ...result });
});

// Granola webhook (for Zapier integration)
app.post('/api/webhook/granola', (req, res) => {
  const notes = loadNotes();
  const body = req.body;
  const sourceId = `granola-wh-${body.id || crypto.createHash('md5').update(JSON.stringify(body)).digest('hex')}`;
  const existing = notes.find(n => n.sourceId === sourceId);

  if (!existing) {
    notes.push({
      id: generateId(),
      sourceId,
      title: body.title || 'Meeting Note',
      content: body.notes || body.content || body.summary || '',
      source: 'granola',
      sourceUrl: body.url || '',
      sourceMeta: {
        meetingTitle: body.title,
        participants: body.participants || [],
        viaWebhook: true,
      },
      tags: ['meeting'],
      folder: 'Meetings',
      starred: false,
      createdAt: body.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedAt: new Date().toISOString(),
    });
    saveNotes(notes);
  }

  res.json({ success: true });
});

// Get all folders
app.get('/api/folders', (req, res) => {
  const notes = loadNotes();
  const folders = [...new Set(notes.map(n => n.folder))].sort();
  res.json({ folders });
});

// Get all tags
app.get('/api/tags', (req, res) => {
  const notes = loadNotes();
  const tags = [...new Set(notes.flatMap(n => n.tags))].sort();
  res.json({ tags });
});

// Settings
app.get('/api/settings', (req, res) => res.json(loadSettings()));
app.put('/api/settings', (req, res) => {
  const settings = { ...loadSettings(), ...req.body };
  saveSettings(settings);
  res.json(settings);
});

// Apple Shortcuts setup info
app.get('/api/setup/apple-shortcut', (req, res) => {
  const publicUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
  res.json({
    webhookUrl: `${publicUrl}/api/webhook/apple-notes`,
    secret: appleNotesSecret ? '(configured — use the secret from your .env)' : '(no secret configured)',
    instructions: [
      'Open the Shortcuts app on your iPhone',
      'Create a new Shortcut',
      'Add action: "Find All Notes" (optionally filter by modification date)',
      'Add action: "Repeat with Each" over the found notes',
      'Inside the loop, add "Get Contents of URL" with:',
      `  URL: ${publicUrl}/api/webhook/apple-notes`,
      '  Method: POST',
      '  Headers: Content-Type: application/json' + (appleNotesSecret ? ', x-webhook-secret: (your secret)' : ''),
      '  Body (JSON): { "title": [Name], "content": [Body], "folder": [Folder], "id": [Name], "modifiedAt": [Modification Date] }',
      'Save the Shortcut',
      'To automate: Create a Personal Automation → Time of Day → run your shortcut',
    ],
  });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Background Sync ────────────────────────────────────────────────────────
const SLACK_INTERVAL = (parseInt(process.env.SLACK_SYNC_INTERVAL) || 5) * 60 * 1000;
const GRANOLA_INTERVAL = (parseInt(process.env.GRANOLA_SYNC_INTERVAL) || 10) * 60 * 1000;

function startBackgroundSync() {
  // Initial sync after a short delay
  setTimeout(async () => {
    console.log('[Sync] Running initial sync...');
    await Promise.allSettled([slackSync.sync(), granolaSync.sync()]);
  }, 3000);

  // Periodic Slack sync
  if (slackSync.enabled) {
    setInterval(() => slackSync.sync(), SLACK_INTERVAL);
    console.log(`[Sync] Slack sync every ${SLACK_INTERVAL / 60000} minutes`);
  }

  // Periodic Granola sync
  if (granolaSync.enabled) {
    setInterval(() => granolaSync.sync(), GRANOLA_INTERVAL);
    console.log(`[Sync] Granola sync every ${GRANOLA_INTERVAL / 60000} minutes`);
  }

  console.log(`[Sync] Apple Notes: webhook at /api/webhook/apple-notes`);
}

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Unified Notes running on http://localhost:${PORT}\n`);
  console.log('  Integrations:');
  console.log(`    Slack:       ${slackSync.enabled ? 'ENABLED' : 'disabled (set SLACK_USER_TOKEN)'}`);
  console.log(`    Granola:     ${granolaSync.enabled ? 'ENABLED' : 'disabled (set GRANOLA_ACCESS_TOKEN or GRANOLA_AUTO_DETECT)'}`);
  console.log(`    Apple Notes: ${appleNotesSecret ? 'ENABLED (webhook)' : 'disabled (set APPLE_NOTES_WEBHOOK_SECRET)'}\n`);
  startBackgroundSync();
});
