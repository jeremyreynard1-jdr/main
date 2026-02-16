# Product Research Assistant

AI-powered product research tool that deeply analyzes products across Amazon reviews,
Reddit discussions, and more — then learns your preferences over time.

## Features

- **Multi-source research**: Scrapes Amazon reviews (with photo extraction) and Reddit discussions (with credibility scoring)
- **Claude AI analysis**: Fake review detection, hype scoring, risk assessment, personalized gotchas
- **Comparison mode**: Side-by-side analysis of 2-3 products with head-to-head breakdown
- **Preference learning**: Captures your priorities, dealbreakers, and learns from purchase satisfaction surveys
- **Smart verdicts**: Clear buy/skip/wait recommendation with confidence score and reasoning
- **Visual evidence**: Links to Reddit threads, Amazon review photos, credibility indicators
- **Save & track**: Considering list, search history, purchase outcome tracking
- **Streaming progress**: Real-time SSE updates showing analysis progress
- **Mobile-responsive**: Clean dark-themed UI that works on all devices

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API keys

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run the server

```bash
python run.py
```

Open http://localhost:8000 in your browser.

## API Keys Setup Guide

### Required: Anthropic API Key (Claude)

1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Go to API Keys → Create Key
4. Copy the key to your `.env` file as `ANTHROPIC_API_KEY`

> **Without this key**, the app still works but uses basic heuristic analysis instead of AI-powered analysis.

### Optional: Reddit API (improves Reddit data quality)

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app" at the bottom
3. Select "script" type
4. Set redirect URI to `http://localhost:8000`
5. Copy client ID and secret to `.env`

> **Without Reddit API keys**, the app uses Reddit's public JSON endpoints (works fine for most searches).

### Optional: YouTube Data API (Phase 3)

1. Go to https://console.cloud.google.com/
2. Enable "YouTube Data API v3"
3. Create an API key under Credentials
4. Add to `.env` as `YOUTUBE_API_KEY`

### Optional: Google Custom Search API (Phase 3)

1. Create a Programmable Search Engine at https://programmablesearchengine.google.com/
2. Get API key from Google Cloud Console
3. Add both `GOOGLE_API_KEY` and `GOOGLE_CSE_ID` to `.env`

## Architecture

```
backend/
├── app.py                      # FastAPI entry point
├── models/
│   └── schemas.py              # Pydantic models (requests, responses, data)
├── routers/
│   ├── research.py             # /api/research/* endpoints
│   └── preferences_router.py   # /api/preferences/* endpoints
└── services/
    ├── amazon_scraper.py       # Amazon product search + review scraping
    ├── reddit_scraper.py       # Reddit discussion search + credibility scoring
    ├── analyzer.py             # Claude API analysis + comparison engine
    ├── cache.py                # In-memory TTL cache (swap for Redis)
    └── preferences.py          # JSON-based preference storage + learning

frontend/
├── templates/
│   └── index.html              # Single-page application
└── static/
    ├── css/style.css           # Dark theme styles
    └── js/app.js               # Frontend application logic

data/
├── sample_preferences.json     # Example learned preference structure
└── sample_comparison.json      # Example comparison mode output
```

## API Endpoints

### Research
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/research/analyze` | Run full product analysis (blocking) |
| POST | `/api/research/analyze/stream` | Streaming analysis with SSE progress |
| POST | `/api/research/compare` | Compare 2-3 products head-to-head |
| GET | `/api/research/analysis/{id}` | Retrieve a past analysis |
| GET | `/api/research/history` | Get search history |

### Preferences
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preferences/` | Get all user preferences |
| POST | `/api/preferences/category` | Update category-specific preferences |
| POST | `/api/preferences/global` | Update global priorities & dealbreakers |
| POST | `/api/preferences/satisfaction` | Submit purchase satisfaction survey |
| GET | `/api/preferences/sensitivity` | View learned sensitivity profile |
| GET | `/api/preferences/saved` | Get saved/considering products |
| POST | `/api/preferences/saved` | Save a product to considering list |
| DELETE | `/api/preferences/saved/{id}` | Remove a saved product |

## Preference Learning System

The app learns your preferences through two mechanisms:

1. **Explicit preferences**: Select priorities and dealbreakers in the Preferences tab
2. **Implicit learning**: Submit satisfaction surveys for past purchases

Over time, the system builds a **sensitivity profile** that tracks how much each factor
matters to you. Products are then analyzed through the lens of your personal preferences.

### Sample Preference Structure

See `data/sample_preferences.json` for a complete example showing:
- Category-specific priorities and dealbreakers
- Purchase history with satisfaction scores
- Learned sensitivity profile
- Pickiness detection per category

## Deployment

### Railway

1. Push your code to a GitHub repo
2. Connect Railway to your repo at https://railway.app/
3. Add environment variables (ANTHROPIC_API_KEY, etc.)
4. Railway auto-detects the `Procfile` and deploys

### Render

1. Create a new Web Service at https://render.com/
2. Connect your GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Docker (optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Development Phases

- [x] **Phase 1**: Single product analysis (Amazon + Reddit)
- [x] **Phase 2**: Comparison mode (2-3 products head-to-head)
- [ ] **Phase 3**: YouTube timestamps, professional reviews, price tracking
- [ ] **Phase 4**: Redis caching, background refresh, shareable links

## Rate Limiting & Scraping

The scrapers include built-in protections:
- Random delays between requests (1-2.5s)
- User-agent rotation
- Graceful error handling on rate limits
- In-memory caching to avoid repeated scrapes (30-min TTL)
