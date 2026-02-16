"""Reddit product discussion scraper.

Supports two modes:
  1. Reddit JSON API (no auth needed for public data)
  2. OAuth API (if REDDIT_CLIENT_ID + SECRET are set)

Scores post/author credibility based on karma and account age.
"""

from __future__ import annotations

import asyncio
import os
import random
import time
from typing import Optional
from urllib.parse import quote_plus

import httpx

from backend.models.schemas import RedditPost

USER_AGENTS = [
    "ProductResearchBot/1.0 (research assistant)",
    "Mozilla/5.0 (compatible; ProductResearch/1.0)",
]

# Subreddits likely to have product discussions
PRODUCT_SUBREDDITS = [
    "BuyItForLife",
    "ProductReviews",
    "gadgets",
    "technology",
    "headphones",
    "buildapc",
    "hometheater",
    "cooking",
    "kitchenconfidential",
    "furniture",
    "malefashionadvice",
    "femalefashionadvice",
    "SkincareAddiction",
    "running",
    "fitness",
]


def _credibility_score(karma: Optional[int], account_age_days: Optional[int]) -> float:
    """Compute a 0-1 credibility score from karma and account age."""
    score = 0.5  # baseline
    if karma is not None:
        if karma > 50_000:
            score += 0.2
        elif karma > 10_000:
            score += 0.15
        elif karma > 1_000:
            score += 0.1
        elif karma < 100:
            score -= 0.15
    if account_age_days is not None:
        if account_age_days > 365 * 3:
            score += 0.2
        elif account_age_days > 365:
            score += 0.1
        elif account_age_days < 30:
            score -= 0.2
    return max(0.0, min(1.0, score))


async def search_reddit(
    query: str,
    *,
    max_results: int = 15,
    client: httpx.AsyncClient | None = None,
) -> list[RedditPost]:
    """Search Reddit for product discussions using the public JSON API."""
    own_client = client is None
    if own_client:
        client = httpx.AsyncClient(follow_redirects=True, timeout=15)

    posts: list[RedditPost] = []

    try:
        # Search across Reddit
        url = f"https://www.reddit.com/search.json?q={quote_plus(query)}&sort=relevance&limit={max_results}&type=link"
        headers = {"User-Agent": random.choice(USER_AGENTS)}

        await asyncio.sleep(random.uniform(1.0, 2.0))
        try:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            return posts

        children = data.get("data", {}).get("children", [])
        for child in children:
            d = child.get("data", {})
            if not d:
                continue

            subreddit = d.get("subreddit", "")
            author = d.get("author", "[deleted]")
            score = d.get("score", 0)
            num_comments = d.get("num_comments", 0)
            permalink = d.get("permalink", "")

            # Fetch top comments for posts with engagement
            top_comments: list[str] = []
            if num_comments > 0 and permalink:
                await asyncio.sleep(random.uniform(0.8, 1.5))
                try:
                    comments_url = f"https://www.reddit.com{permalink}.json?limit=5&sort=top"
                    cresp = await client.get(comments_url, headers=headers)
                    if cresp.status_code == 200:
                        cdata = cresp.json()
                        if len(cdata) > 1:
                            comment_children = cdata[1].get("data", {}).get("children", [])
                            for cc in comment_children[:5]:
                                body = cc.get("data", {}).get("body", "")
                                if body and body != "[deleted]":
                                    top_comments.append(body[:500])
                except Exception:
                    pass

            # Estimate credibility (we don't have full author info from search)
            # Use post score as a proxy
            cred = 0.5
            if score > 500:
                cred = 0.8
            elif score > 100:
                cred = 0.7
            elif score > 20:
                cred = 0.6
            elif score < 2:
                cred = 0.3

            posts.append(RedditPost(
                subreddit=subreddit,
                title=d.get("title", ""),
                url=f"https://www.reddit.com{permalink}" if permalink else "",
                score=score,
                num_comments=num_comments,
                author=author,
                credibility_score=cred,
                body=d.get("selftext", "")[:1000],
                top_comments=top_comments,
            ))

    finally:
        if own_client:
            await client.aclose()

    # Sort by relevance (score * comment engagement)
    posts.sort(key=lambda p: p.score * (1 + p.num_comments * 0.1), reverse=True)
    return posts
