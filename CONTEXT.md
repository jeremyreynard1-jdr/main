# Expansion Center — Project Context

You're continuing work on a Next.js site pitching Vilgot (Legora's hiring
manager) for the **Head of Market Expansion** role. The artifact IS the
pitch — a Vercel-deployed, interactive "Expansion Center" dashboard that
reads like the operating tool the role would actually ship on day 30.

**Repo**: `jeremyreynard1-jdr/legora-market-expansion` (this repo, deployed
at https://legora-market-expansion.vercel.app — Vercel auto-deploys the
`main` branch).

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind · Lucide ·
react-simple-maps · plain TS data in `src/data/*.ts`.

**Routes**:
```
/                    Home — Launch Control Center + Operating Rhythm
/map                 Coverage Map (Legora vs Harvey pins, targets)
/intel               Competitive Intel (filterable cards, compare tray)
/signals             Signals Feed (news / hires / RFPs / funding)
/playbooks           Workflow Generator (Playbook + Weekly Update)
/plan                30-60-90 day plan, final reveal card
```

---

## Brand / tone constraints (non-negotiable)

**Palette — Legora's own brand** (cream + sage + forest):
- `bg` `#FAFAF7` · `bg-alt` `#F1EEE6` · `surface` `#FFFFFF`
- `sage` `#C5D4B9` (signature) · `sage-soft` `#E4EDDB`
- `gold` token is **forest green** `#1F3D2E` (accent for chips, dots, active
  states — name retained to avoid renaming 26 files)
- Borders warm cream `#E4E0D6`
- Ink `#0B0F0C` · muted `#5A6359`

**Typography**:
- Display: **Instrument Serif** (matches Legora's wordmark vibe — see
  `.font-display` in `app/globals.css`)
- Body: Inter
- Mono: JetBrains Mono — use sparingly for eyebrows, dates, source tags

**Voice**:
- The site reads like an internal tool, NOT a pitch deck
- Zero first-person ("I'd install", "I ship", "what I'd do") in UI copy
- Zero "Hi Vilgot" / "built for Vilgot" / "Head of Market Expansion pitch"
- The ONLY place personal branding appears is the final card on `/plan`
  (Jeremy Reynard reveal with LinkedIn link) — keep that.

**Data discipline**:
- Real facts → `source: <url>` field pointing to primary sources (vendor
  newsroom, firm press release, Bloomberg/TechCrunch/Artificial Lawyer).
- Inferred/estimated facts → `illustrative: true` field + visible
  `<IllustrativeChip>` with assumption.
- **Signals module is real-only — no illustrative items.** Rest of the
  site allows illustrative with explicit chip.
- Blacklisted aggregator sources: startuphub.ai, streamline.ai, other
  generic listicles. Use primary only.

---

## What's already done (as of commit 767ca55)

1. Full site scaffolded with all 6 routes + data layer
2. 9-item a11y/quality punch list applied (stable keys, aria-labels on
   icon-only buttons, focus rings, empty states, hover states)
3. **Palette swapped** from original dark navy/gold → light cream/sage/forest
4. **Serif display font** (Instrument Serif) wired up
5. **Favicon** added: four-point star in forest green (see
   `app/favicon.svg`)
6. **Renamed** "The Expansion Index" → "Expansion Center" everywhere
7. **Personal pitch voice stripped** from home hero, footer, timeline,
   `/plan` reveal, rhythm calendar, data file comments
8. **WorldMap** hard-coded hex colors swapped to cream land + forest/red
   pins + white pin strokes

---

## What's pending (prioritized)

### 1. Signals module rebuild (`app/signals/page.tsx`, `components/signals/*`)
- **Drop every illustrative signal from `src/data/signals.ts`** — real
  sourced only. If that leaves too few, pull more from the research notes
  in `RESEARCH-NOTES.md` or do fresh research.
- New card layout — current layout is too dense, too many tags, hard to
  read. Reduce tag count, clearer hierarchy (headline > so-what > source).
- **Add a date range filter**: Last 7d · 30d · 90d · All (the SignalFilterBar
  currently filters by source/type/region but has no time dimension).

### 2. Map deep research sweep (`src/data/customers.ts`, `src/data/targets.ts`)
- The background research agent found **70 named customers** (32 Legora +
  38 Harvey) — full details in `RESEARCH-NOTES.md`. Fold those into
  `customers.ts`, keeping the existing schema (lat, lon, firm tier, stage,
  source URL).
- Current `customers.ts` only has ~16 Legora + ~4 Harvey records — it
  looked under-pinned given Legora claims 800+ customers. 70 named is a
  defensible minimum.
- Keep the source URL on every pin. If a customer is enterprise/in-house
  (not a law firm), consider a visual differentiator.

### 3. Playbooks redesign (`components/generator/PlaybookOutput.tsx`,
   `components/generator/WeeklyUpdateOutput.tsx`)
- Current layout is hard to read — too many sections crammed, low visual
  hierarchy, chips that fight each other.
- Simplify — the whole playbook should feel like a well-typeset Notion
  doc, not a data dashboard.
- Eliminate any residual pitch-voice copy you find.

### 4. Content pruning pass (across all modules)
- Cut ~40% of copy. Shorter descriptions, fewer hint lines, tighter
  subtitles. Legora's own site is minimalist — match that.
- Especially trim: home page stat tile `hint`s, `ModuleHeader` subtitles,
  card-level secondary text.

### 5. Competitive Intel polish (`app/intel/page.tsx`, `components/competitors/*`)
- Hasn't had a review pass since the rebrand. Check that card density
  feels right in the new light palette. Compare tray probably needs a
  once-over.

---

## File structure cheatsheet

```
app/
  layout.tsx                  top nav + footer + font loading
  page.tsx                    Home
  map/page.tsx
  intel/page.tsx
  signals/page.tsx
  playbooks/page.tsx
  plan/page.tsx
  globals.css                 tokens + focus-visible + .font-display
  favicon.svg                 four-point star forest green
components/
  TopNav.tsx                  brand lockup + tabs
  Footer.tsx
  SourceLink.tsx              pattern for source attribution
  IllustrativeChip.tsx        pattern for flagging non-real data
  ModuleHeader.tsx            eyebrow/title/subtitle/right slot
  StatTile.tsx
  ModuleGrid.tsx              the "other modules" grid on home
  control-center/             Home: LaunchBoard, Readiness, Stage, Rhythm, ThisWeek
  competitors/                Intel: CompetitorCard, FilterBar, CompareTray
  signals/                    Signals: SignalCard, SignalFilterBar
  generator/                  Playbooks: PlaybookForm/Output + WeeklyUpdateForm/Output
  map/WorldMap.tsx
  timeline/Timeline.tsx       /plan
src/data/
  customers.ts                real, sourced — EXPAND with research notes
  competitors.ts              real, sourced (with a few illustrative facts flagged)
  launches.ts                 illustrative (internal ops simulation)
  targets.ts                  illustrative (every record marked illustrative: true)
  rhythm.ts                   illustrative (operating cadence)
  playbooks.ts                4 pre-baked real examples
  signals.ts                  mixed — SWEEP TO REAL-ONLY per pending work
  timeline.ts                 30-60-90 milestones
lib/cn.ts
tailwind.config.ts            color tokens, font families
```

---

## Verification before deploy

- `npm run build` — clean, 9/9 routes prerender
- Click every module in dev + on mobile
- Confirm every real record has a resolvable source URL
- Confirm every illustrative record has a visible chip
- No "Vilgot" / "pitch" / "Head of Market Expansion" / first-person voice
  anywhere outside the final `/plan` reveal card

---

## Git workflow

This repo's `main` branch is what Vercel watches. Commit + push to `main`.
Every push auto-deploys.
