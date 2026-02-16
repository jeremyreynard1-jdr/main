"""API routes for product research, comparison, and analysis."""

from __future__ import annotations

import asyncio
import json
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from backend.models.schemas import (
    CompareRequest,
    ProductAnalysis,
    ProductCategory,
    ResearchRequest,
    ComparisonResult,
)
from backend.services.amazon_scraper import fetch_reviews, search_product
from backend.services.analyzer import analyze_product, compare_products
from backend.services.cache import analysis_cache, product_cache
from backend.services.preferences import load_preferences, save_search
from backend.services.reddit_scraper import search_reddit

router = APIRouter(prefix="/api/research", tags=["research"])

# In-memory store for completed analyses (swap for DB later)
_analyses: dict[str, ProductAnalysis] = {}


@router.post("/analyze")
async def analyze(req: ResearchRequest) -> dict:
    """Run a full product analysis pipeline.

    Returns a streaming-style response with progress updates,
    then the final analysis.
    """
    # Check cache first
    cache_key = f"analysis:{req.query}:{req.category}"
    cached = analysis_cache.get(cache_key)
    if cached:
        return {"status": "complete", "analysis": cached}

    # Step 1: Search Amazon
    product_info = await search_product(req.query)

    # Step 2: Fetch reviews
    reviews = []
    if product_info and product_info.get("asin"):
        reviews = await fetch_reviews(
            product_info["asin"],
            max_pages=min(req.max_reviews // 10, 5),
        )

    # Step 3: Search Reddit
    reddit_posts = []
    if req.include_reddit:
        reddit_posts = await search_reddit(req.query, max_results=15)

    # Step 4: Determine category
    category = req.category or ProductCategory.OTHER

    # Step 5: Load preferences
    preferences = load_preferences()

    # Step 6: Run AI analysis
    analysis = await analyze_product(
        query=req.query,
        product_info=product_info,
        reviews=reviews,
        reddit_posts=reddit_posts,
        category=category,
        preferences=preferences,
    )

    # Store & cache
    _analyses[analysis.id] = analysis
    analysis_cache.set(cache_key, analysis.model_dump())
    save_search(req.query, analysis.id, analysis.product_name)

    return {"status": "complete", "analysis": analysis.model_dump()}


@router.post("/analyze/stream")
async def analyze_stream(req: ResearchRequest):
    """SSE endpoint that streams progress updates during analysis."""

    async def event_stream():
        yield _sse_event("progress", {"stage": "search", "detail": f"Searching Amazon for '{req.query}'...", "progress": 0.1})

        product_info = await search_product(req.query)
        product_name = product_info.get("title", req.query) if product_info else req.query

        yield _sse_event("progress", {"stage": "search", "detail": f"Found: {product_name}", "progress": 0.2})

        reviews = []
        if product_info and product_info.get("asin"):
            yield _sse_event("progress", {"stage": "reviews", "detail": "Fetching Amazon reviews...", "progress": 0.3})
            reviews = await fetch_reviews(product_info["asin"], max_pages=3)
            yield _sse_event("progress", {"stage": "reviews", "detail": f"Collected {len(reviews)} Amazon reviews", "progress": 0.5})

        reddit_posts = []
        if req.include_reddit:
            yield _sse_event("progress", {"stage": "reddit", "detail": "Searching Reddit discussions...", "progress": 0.6})
            reddit_posts = await search_reddit(req.query, max_results=15)
            yield _sse_event("progress", {"stage": "reddit", "detail": f"Found {len(reddit_posts)} Reddit discussions", "progress": 0.7})

        category = req.category or ProductCategory.OTHER
        preferences = load_preferences()

        yield _sse_event("progress", {"stage": "analysis", "detail": f"Analyzing {len(reviews)} reviews and {len(reddit_posts)} discussions...", "progress": 0.8})

        analysis = await analyze_product(
            query=req.query,
            product_info=product_info,
            reviews=reviews,
            reddit_posts=reddit_posts,
            category=category,
            preferences=preferences,
        )

        _analyses[analysis.id] = analysis
        cache_key = f"analysis:{req.query}:{req.category}"
        analysis_cache.set(cache_key, analysis.model_dump())
        save_search(req.query, analysis.id, analysis.product_name)

        yield _sse_event("progress", {"stage": "complete", "detail": "Analysis complete!", "progress": 1.0})
        yield _sse_event("result", analysis.model_dump())

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/compare")
async def compare(req: CompareRequest) -> dict:
    """Compare 2-3 products head-to-head."""
    if len(req.products) < 2 or len(req.products) > 3:
        raise HTTPException(400, "Provide 2-3 products to compare")

    # Analyze each product (use cache where available)
    analyses: list[ProductAnalysis] = []
    for product_query in req.products:
        cache_key = f"analysis:{product_query}:{req.category}"
        cached = analysis_cache.get(cache_key)
        if cached:
            analyses.append(ProductAnalysis(**cached))
        else:
            # Run fresh analysis
            product_info = await search_product(product_query)
            reviews = []
            if product_info and product_info.get("asin"):
                reviews = await fetch_reviews(product_info["asin"], max_pages=2)
            reddit_posts = await search_reddit(product_query, max_results=10)
            category = req.category or ProductCategory.OTHER
            preferences = load_preferences()

            analysis = await analyze_product(
                query=product_query,
                product_info=product_info,
                reviews=reviews,
                reddit_posts=reddit_posts,
                category=category,
                preferences=preferences,
            )
            _analyses[analysis.id] = analysis
            analysis_cache.set(cache_key, analysis.model_dump())
            analyses.append(analysis)

    # Run comparison
    preferences = load_preferences()
    result = await compare_products(
        analyses,
        preferences=preferences,
        priorities=req.priorities or None,
    )

    return {"status": "complete", "comparison": result.model_dump()}


@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str) -> dict:
    """Retrieve a previously computed analysis."""
    analysis = _analyses.get(analysis_id)
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    return analysis.model_dump()


@router.get("/history")
async def search_history():
    """Get recent search history."""
    from backend.services.preferences import load_search_history
    return load_search_history()


def _sse_event(event_type: str, data: dict) -> str:
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
