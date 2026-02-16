/* ========================================================================
   Product Research Assistant – Frontend Application
   ======================================================================== */

const API = "";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentAnalysis = null;
let currentComparison = null;
let searchHistory = [];
let savedProducts = [];
let userPreferences = null;

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function show(el) { if (typeof el === "string") el = $(el); if (el) el.style.display = ""; }
function hide(el) { if (typeof el === "string") el = $(el); if (el) el.style.display = "none"; }

function html(sel, content) {
    const el = $(sel);
    if (el) el.innerHTML = content;
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    setupSearch();
    setupComparison();
    setupPreferences();
    loadHistory();
    loadSavedProducts();
    loadPreferences();
});

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
function setupTabs() {
    $$(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            $$(".tab").forEach((t) => t.classList.remove("active"));
            $$(".tab-content").forEach((tc) => tc.classList.remove("active"));
            tab.classList.add("active");
            const target = tab.dataset.tab;
            const panel = $(`#${target}`);
            if (panel) panel.classList.add("active");
        });
    });
}

// ---------------------------------------------------------------------------
// Search / Analyze
// ---------------------------------------------------------------------------
function setupSearch() {
    const input = $("#search-input");
    const btn = $("#search-btn");

    btn.addEventListener("click", () => runAnalysis());
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runAnalysis();
    });
}

async function runAnalysis() {
    const query = $("#search-input").value.trim();
    if (!query) return;

    const category = $("#category-select").value;
    const btn = $("#search-btn");
    btn.disabled = true;

    show("#progress-section");
    hide("#results-section");
    hide("#empty-state");

    try {
        // Use SSE streaming endpoint
        const resp = await fetch(`${API}/api/research/analyze/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                category: category || null,
                include_reddit: true,
                max_reviews: 100,
            }),
        });

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    // next data line
                } else if (line.startsWith("data: ")) {
                    const jsonStr = line.slice(6);
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.progress !== undefined) {
                            updateProgress(data);
                        } else {
                            // This is the final result
                            currentAnalysis = data;
                            renderAnalysis(data);
                        }
                    } catch (e) {
                        // ignore parse errors on partial data
                    }
                }
            }
        }
    } catch (err) {
        // Fallback to non-streaming
        try {
            const resp = await fetch(`${API}/api/research/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query,
                    category: category || null,
                    include_reddit: true,
                    max_reviews: 100,
                }),
            });
            const data = await resp.json();
            if (data.analysis) {
                currentAnalysis = data.analysis;
                renderAnalysis(data.analysis);
            }
        } catch (e2) {
            html("#progress-detail", `Error: ${e2.message}`);
        }
    } finally {
        btn.disabled = false;
    }
}

function updateProgress(data) {
    const pct = Math.round((data.progress || 0) * 100);
    const bar = $(".progress-bar-inner");
    if (bar) bar.style.width = `${pct}%`;
    html("#progress-stage", data.stage || "");
    html("#progress-detail", data.detail || "");
}

// ---------------------------------------------------------------------------
// Render Analysis
// ---------------------------------------------------------------------------
function renderAnalysis(a) {
    hide("#progress-section");
    show("#results-section");

    // Header
    html("#result-product-name", escapeHtml(a.product_name || a.query));
    html("#result-category", a.category || "");

    // Price & rating
    const priceStr = a.price ? `$${a.price.toFixed(2)}` : "Price N/A";
    const ratingStr = a.overall_rating ? `${a.overall_rating}/5` : "N/A";
    html("#result-price", priceStr);
    html("#result-rating", ratingStr);

    // Verdict
    const verdictEl = $("#result-verdict");
    if (verdictEl && a.verdict) {
        verdictEl.className = `verdict-badge verdict-${a.verdict}`;
        verdictEl.textContent = a.verdict.toUpperCase();
    } else if (verdictEl) {
        verdictEl.className = "verdict-badge";
        verdictEl.textContent = "N/A";
    }

    // Confidence
    renderConfidence(a.confidence || 0);

    // Summary
    html("#result-summary", escapeHtml(a.summary));

    // Verdict reasoning
    html("#result-verdict-reasoning", escapeHtml(a.verdict_reasoning));

    // Pros/Cons
    html("#result-pros", (a.pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join(""));
    html("#result-cons", (a.cons || []).map((c) => `<li>${escapeHtml(c)}</li>`).join(""));

    // Stats
    const amazonCount = a.sources_analyzed?.amazon_reviews || 0;
    const redditCount = a.sources_analyzed?.reddit_posts || 0;
    html("#stat-amazon", amazonCount);
    html("#stat-reddit", redditCount);
    html("#stat-hype", a.hype_score != null ? `${Math.round(a.hype_score * 100)}%` : "N/A");

    // Fake review analysis
    renderFakeReviewAlert(a.fake_review_analysis);

    // Gotchas
    renderGotchas(a.gotchas || []);

    // Risk assessment
    renderRisk(a.risk_assessment);

    // Alternatives
    renderAlternatives(a.alternatives || []);

    // Reddit posts
    renderRedditPosts(a.reddit_posts || []);

    // Amazon review photos
    renderReviewPhotos(a.amazon_reviews || []);

    // Setup expandable sections
    setupExpandables();
}

function renderConfidence(score) {
    const pct = Math.round(score * 100);
    let color = "var(--green)";
    if (pct < 50) color = "var(--red)";
    else if (pct < 75) color = "var(--yellow)";

    html("#confidence-section", `
        <div class="confidence-meter">
            <div class="confidence-bar">
                <div class="confidence-fill" style="width:${pct}%; background:${color}"></div>
            </div>
            <span class="confidence-label">${pct}% confidence</span>
        </div>
    `);
}

function renderFakeReviewAlert(fa) {
    const container = $("#fake-review-section");
    if (!container || !fa) { if (container) container.innerHTML = ""; return; }

    const pct = fa.fake_percentage_estimate || 0;
    let cls = "fake-alert-ok";
    let icon = "\u2713";
    let msg = "Reviews appear genuine";
    if (pct > 30) {
        cls = "fake-alert-danger";
        icon = "\u26A0";
        msg = `~${Math.round(pct)}% of reviews may be fake`;
    } else if (pct > 10) {
        cls = "fake-alert-warn";
        icon = "\u26A0";
        msg = `~${Math.round(pct)}% of reviews may be suspicious`;
    }

    const adjusted = fa.adjusted_rating ? ` (adjusted rating: ${fa.adjusted_rating.toFixed(1)}/5)` : "";
    const signals = (fa.signals || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");

    container.innerHTML = `
        <div class="fake-alert ${cls}">
            <span style="font-size:18px">${icon}</span>
            <div>
                <strong>${msg}${adjusted}</strong>
                <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">
                    Detection confidence: ${Math.round((fa.confidence || 0) * 100)}%
                </div>
                ${signals ? `<ul style="margin-top:8px;padding-left:16px;font-size:13px;color:var(--text-secondary)">${signals}</ul>` : ""}
            </div>
        </div>
    `;
}

function renderGotchas(gotchas) {
    const container = $("#gotchas-section");
    if (!container) return;
    if (!gotchas.length) { container.innerHTML = ""; return; }
    container.innerHTML = `
        <div class="expandable">
            <div class="expandable-header">
                <h4>Gotchas & Dealbreakers (${gotchas.length})</h4>
                <span class="expandable-arrow">\u25BC</span>
            </div>
            <div class="expandable-body">
                <ul style="list-style:none">
                    ${gotchas.map((g) => `<li style="padding:6px 0;padding-left:20px;position:relative;color:var(--text-secondary);font-size:14px">
                        <span style="position:absolute;left:0;color:var(--yellow)">\u26A0</span>${escapeHtml(g)}
                    </li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}

function renderRisk(risk) {
    const container = $("#risk-section");
    if (!container || !risk) { if (container) container.innerHTML = ""; return; }

    const failures = (risk.common_failures || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("");

    container.innerHTML = `
        <div class="expandable">
            <div class="expandable-header">
                <h4>Risk Assessment</h4>
                <span class="expandable-arrow">\u25BC</span>
            </div>
            <div class="expandable-body">
                <div style="display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:14px">
                    <span style="color:var(--text-secondary)">Return rate:</span>
                    <span>${escapeHtml(risk.return_rate_estimate || "Unknown")}</span>
                    <span style="color:var(--text-secondary)">Longevity:</span>
                    <span>${escapeHtml(risk.longevity_estimate || "Unknown")}</span>
                    <span style="color:var(--text-secondary)">Warranty:</span>
                    <span>${escapeHtml(risk.warranty_notes || "No info")}</span>
                </div>
                ${failures ? `<div style="margin-top:12px"><strong style="font-size:13px;color:var(--text-secondary)">Common failures:</strong><ul style="margin-top:6px;padding-left:16px;font-size:13px;color:var(--text-secondary)">${failures}</ul></div>` : ""}
            </div>
        </div>
    `;
}

function renderAlternatives(alts) {
    const container = $("#alternatives-section");
    if (!container) return;
    if (!alts.length) { container.innerHTML = ""; return; }
    container.innerHTML = `
        <div class="expandable">
            <div class="expandable-header">
                <h4>Alternatives to Consider (${alts.length})</h4>
                <span class="expandable-arrow">\u25BC</span>
            </div>
            <div class="expandable-body">
                ${alts.map((a) => `<span class="tag tag-blue" style="cursor:pointer" onclick="searchAlternative('${escapeAttr(a)}')">${escapeHtml(a)}</span>`).join("")}
            </div>
        </div>
    `;
}

function renderRedditPosts(posts) {
    const container = $("#reddit-section");
    if (!container) return;
    if (!posts.length) { container.innerHTML = ""; return; }

    const items = posts.slice(0, 8).map((p) => {
        let credClass = "cred-medium";
        if (p.credibility_score >= 0.7) credClass = "cred-high";
        else if (p.credibility_score < 0.4) credClass = "cred-low";

        return `
            <div style="padding:12px 0;border-bottom:1px solid var(--border)">
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="credibility-dot ${credClass}"></span>
                    <a href="${escapeAttr(p.url)}" target="_blank" rel="noopener" class="source-link" style="font-weight:600;font-size:14px">${escapeHtml(p.title)}</a>
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
                    r/${escapeHtml(p.subreddit)} &middot; Score: ${p.score} &middot; ${p.num_comments} comments
                </div>
                ${p.top_comments?.length ? `<div style="margin-top:8px;padding-left:12px;border-left:2px solid var(--border);font-size:13px;color:var(--text-secondary)">${escapeHtml(p.top_comments[0].slice(0, 200))}${p.top_comments[0].length > 200 ? "..." : ""}</div>` : ""}
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <div class="expandable">
            <div class="expandable-header">
                <h4>Reddit Discussions (${posts.length})</h4>
                <span class="expandable-arrow">\u25BC</span>
            </div>
            <div class="expandable-body">${items}</div>
        </div>
    `;
}

function renderReviewPhotos(reviews) {
    const container = $("#photos-section");
    if (!container) return;

    const photos = [];
    for (const r of reviews) {
        for (const url of r.photo_urls || []) {
            photos.push(url);
            if (photos.length >= 12) break;
        }
        if (photos.length >= 12) break;
    }

    if (!photos.length) { container.innerHTML = ""; return; }

    container.innerHTML = `
        <div class="expandable">
            <div class="expandable-header">
                <h4>Customer Photos (${photos.length})</h4>
                <span class="expandable-arrow">\u25BC</span>
            </div>
            <div class="expandable-body">
                <div class="review-photos">
                    ${photos.map((url) => `<img src="${escapeAttr(url)}" alt="Customer photo" class="review-photo" onclick="window.open('${escapeAttr(url)}','_blank')">`).join("")}
                </div>
            </div>
        </div>
    `;
}

function setupExpandables() {
    $$(".expandable-header").forEach((header) => {
        header.addEventListener("click", () => {
            header.parentElement.classList.toggle("open");
        });
    });
}

function searchAlternative(name) {
    $("#search-input").value = name;
    runAnalysis();
    // Switch to research tab
    $$(".tab")[0]?.click();
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------
function setupComparison() {
    const btn = $("#compare-btn");
    if (btn) btn.addEventListener("click", runComparison);
}

async function runComparison() {
    const p1 = $("#compare-input-1")?.value.trim();
    const p2 = $("#compare-input-2")?.value.trim();
    const p3 = $("#compare-input-3")?.value.trim();

    const products = [p1, p2, p3].filter(Boolean);
    if (products.length < 2) {
        alert("Enter at least 2 products to compare");
        return;
    }

    const btn = $("#compare-btn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Comparing...';
    html("#comparison-result", "");

    try {
        const resp = await fetch(`${API}/api/research/compare`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products }),
        });
        const data = await resp.json();
        if (data.comparison) {
            currentComparison = data.comparison;
            renderComparison(data.comparison);
        }
    } catch (err) {
        html("#comparison-result", `<p style="color:var(--red)">Error: ${escapeHtml(err.message)}</p>`);
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Compare";
    }
}

function renderComparison(comp) {
    const container = $("#comparison-result");
    if (!container) return;

    // Build header row
    const productNames = (comp.products || []).map((p) => p.product_name || p.query);

    // Head to head table
    const h2h = comp.head_to_head || {};
    const rows = Object.entries(h2h).map(([dim, winner]) => {
        return `<tr>
            <td style="font-weight:600">${escapeHtml(dim.replace(/_/g, " "))}</td>
            <td>${escapeHtml(winner)}</td>
        </tr>`;
    }).join("");

    // Product summaries
    const productCards = (comp.products || []).map((p) => {
        const verdictClass = p.verdict ? `verdict-${p.verdict}` : "";
        return `
            <div class="card" style="flex:1;min-width:250px">
                <h4>${escapeHtml(p.product_name)}</h4>
                <div style="margin:8px 0">
                    ${p.verdict ? `<span class="verdict-badge ${verdictClass}">${p.verdict.toUpperCase()}</span>` : ""}
                    ${p.price ? `<span style="margin-left:8px;color:var(--text-secondary)">$${p.price.toFixed(2)}</span>` : ""}
                </div>
                <p style="font-size:13px;color:var(--text-secondary)">${escapeHtml(p.summary || "")}</p>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <div class="card" style="border-color:var(--accent);margin-top:20px">
            <div class="card-header">
                <div>
                    <h3 class="card-title">Recommendation: ${escapeHtml(comp.recommendation)}</h3>
                    <p style="color:var(--text-secondary);font-size:14px;margin-top:6px">${escapeHtml(comp.reasoning)}</p>
                </div>
            </div>
        </div>

        <div style="display:flex;gap:16px;flex-wrap:wrap;margin:16px 0">
            ${productCards}
        </div>

        ${rows ? `
        <div class="card">
            <h4 style="margin-bottom:12px">Head-to-Head</h4>
            <table class="comparison-table">
                <thead><tr><th>Dimension</th><th>Winner</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>` : ""}
    `;
}

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------
const COMMON_PRIORITIES = [
    "Durability", "Price", "Build quality", "Comfort",
    "Performance", "Battery life", "Design", "Warranty",
    "Ease of use", "Portability", "Noise level", "Size",
    "Brand reputation", "Customer support", "Eco-friendly",
];

const COMMON_DEALBREAKERS = [
    "Poor durability", "Bad customer support", "High price",
    "Short warranty", "Heavy/bulky", "Loud", "Hard to set up",
    "Made in specific country", "Non-repairable", "Subscription required",
];

function setupPreferences() {
    renderPriorityButtons();
}

function renderPriorityButtons() {
    const priContainer = $("#priority-buttons");
    const dbContainer = $("#dealbreaker-buttons");
    if (!priContainer || !dbContainer) return;

    const selectedPri = userPreferences?.global_priorities || [];
    const selectedDb = userPreferences?.global_dealbreakers || [];

    priContainer.innerHTML = COMMON_PRIORITIES.map((p) => {
        const sel = selectedPri.includes(p) ? "selected" : "";
        return `<button class="priority-btn ${sel}" onclick="togglePriority(this, '${p}')">${p}</button>`;
    }).join("");

    dbContainer.innerHTML = COMMON_DEALBREAKERS.map((d) => {
        const sel = selectedDb.includes(d) ? "selected" : "";
        return `<button class="priority-btn ${sel}" onclick="toggleDealbreaker(this, '${d}')">${d}</button>`;
    }).join("");
}

function togglePriority(btn, name) {
    btn.classList.toggle("selected");
    saveGlobalPreferences();
}

function toggleDealbreaker(btn, name) {
    btn.classList.toggle("selected");
    saveGlobalPreferences();
}

async function saveGlobalPreferences() {
    const priorities = [];
    $$("#priority-buttons .priority-btn.selected").forEach((b) => priorities.push(b.textContent));
    const dealbreakers = [];
    $$("#dealbreaker-buttons .priority-btn.selected").forEach((b) => dealbreakers.push(b.textContent));

    try {
        await fetch(`${API}/api/preferences/global`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priorities, dealbreakers }),
        });
    } catch (e) {
        // silent
    }
}

// ---------------------------------------------------------------------------
// Satisfaction Survey
// ---------------------------------------------------------------------------
let surveyRating = 0;

function setRating(score) {
    surveyRating = score;
    $$(".star").forEach((s, i) => {
        s.classList.toggle("active", i < score);
    });
}

async function submitSurvey() {
    const name = $("#survey-product")?.value.trim();
    const category = $("#survey-category")?.value;
    if (!name || !surveyRating) {
        alert("Please enter a product name and rating");
        return;
    }

    const notes = $("#survey-notes")?.value || "";
    const kept = $("#survey-kept")?.checked ?? true;

    // Gather what mattered most
    const matters = [];
    $$("#survey-matters .priority-btn.selected").forEach((b) => matters.push(b.textContent));

    try {
        const resp = await fetch(`${API}/api/preferences/satisfaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_name: name,
                category,
                satisfaction_score: surveyRating,
                kept_product: kept,
                notes,
                what_mattered_most: matters,
            }),
        });
        const data = await resp.json();
        if (data.status === "recorded") {
            alert("Thanks for the feedback! Your preferences have been updated.");
            // Reset form
            $("#survey-product").value = "";
            $("#survey-notes").value = "";
            surveyRating = 0;
            $$(".star").forEach((s) => s.classList.remove("active"));
            $$("#survey-matters .priority-btn").forEach((b) => b.classList.remove("selected"));
        }
    } catch (e) {
        alert("Error submitting survey: " + e.message);
    }
}

// ---------------------------------------------------------------------------
// History & Saved
// ---------------------------------------------------------------------------
async function loadHistory() {
    try {
        const resp = await fetch(`${API}/api/research/history`);
        searchHistory = await resp.json();
        renderHistory();
    } catch (e) {
        // silent
    }
}

function renderHistory() {
    const container = $("#history-list");
    if (!container) return;
    if (!searchHistory.length) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:14px">No searches yet</p>';
        return;
    }

    container.innerHTML = searchHistory.slice().reverse().slice(0, 20).map((h) => {
        const time = new Date(h.timestamp).toLocaleDateString();
        return `
            <div class="history-item" onclick="document.getElementById('search-input').value='${escapeAttr(h.query)}';$$('.tab')[0]?.click();runAnalysis();">
                <span>${escapeHtml(h.product_name || h.query)}</span>
                <span class="history-time">${time}</span>
            </div>
        `;
    }).join("");
}

async function loadSavedProducts() {
    try {
        const resp = await fetch(`${API}/api/preferences/saved`);
        savedProducts = await resp.json();
        renderSaved();
    } catch (e) {
        // silent
    }
}

function renderSaved() {
    const container = $("#saved-list");
    if (!container) return;
    if (!savedProducts.length) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:14px">No saved products yet. Save products from analysis results.</p>';
        return;
    }

    container.innerHTML = savedProducts.map((p) => `
        <div class="saved-item">
            <div class="saved-item-info">
                <div class="saved-item-name">${escapeHtml(p.product_name || p.query)}</div>
                <div class="saved-item-meta">${p.status || "considering"} ${p.target_price ? `&middot; Target: $${p.target_price}` : ""}</div>
            </div>
            <div style="display:flex;gap:8px">
                <button class="btn-icon" onclick="removeSaved('${p.id}')" title="Remove">\u2715</button>
            </div>
        </div>
    `).join("");
}

async function saveCurrentProduct() {
    if (!currentAnalysis) return;
    try {
        await fetch(`${API}/api/preferences/saved`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: currentAnalysis.id,
                product_name: currentAnalysis.product_name,
                query: currentAnalysis.query,
                analysis_id: currentAnalysis.id,
                status: "considering",
            }),
        });
        loadSavedProducts();
    } catch (e) {
        // silent
    }
}

async function removeSaved(id) {
    try {
        await fetch(`${API}/api/preferences/saved/${id}`, { method: "DELETE" });
        loadSavedProducts();
    } catch (e) {
        // silent
    }
}

async function loadPreferences() {
    try {
        const resp = await fetch(`${API}/api/preferences/`);
        userPreferences = await resp.json();
        renderPriorityButtons();
        renderSensitivityProfile();
    } catch (e) {
        // silent
    }
}

function renderSensitivityProfile() {
    const container = $("#sensitivity-profile");
    if (!container || !userPreferences) return;

    const profile = userPreferences.sensitivity_profile || {};
    const entries = Object.entries(profile).filter(([k]) => !k.startsWith("_"));

    if (!entries.length) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:14px">No learned sensitivities yet. Submit purchase satisfaction surveys to build your profile.</p>';
        return;
    }

    container.innerHTML = entries.map(([factor, score]) => {
        const pct = Math.round(score * 100);
        let color = "var(--blue)";
        if (pct > 70) color = "var(--red)";
        else if (pct > 50) color = "var(--yellow)";

        return `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                <span style="min-width:120px;font-size:13px;color:var(--text-secondary)">${escapeHtml(factor)}</span>
                <div style="flex:1;height:6px;background:var(--bg-secondary);border-radius:3px;overflow:hidden;max-width:200px">
                    <div style="height:100%;width:${pct}%;background:${color};border-radius:3px"></div>
                </div>
                <span style="font-size:12px;color:var(--text-muted)">${pct}%</span>
            </div>
        `;
    }).join("");
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
function escapeHtml(str) {
    if (!str) return "";
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#039;");
}

// Make functions available globally
window.runAnalysis = runAnalysis;
window.runComparison = runComparison;
window.searchAlternative = searchAlternative;
window.togglePriority = togglePriority;
window.toggleDealbreaker = toggleDealbreaker;
window.setRating = setRating;
window.submitSurvey = submitSurvey;
window.saveCurrentProduct = saveCurrentProduct;
window.removeSaved = removeSaved;
