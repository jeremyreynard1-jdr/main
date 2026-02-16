"""Amazon product data scraper.

Uses httpx + BeautifulSoup to extract reviews, ratings, and photos.
Respects rate limits with configurable delays and user-agent rotation.
"""

from __future__ import annotations

import asyncio
import random
import re
from typing import Optional
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup

from backend.models.schemas import Review, SourceType

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
]

BASE_URL = "https://www.amazon.com"


def _headers() -> dict[str, str]:
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
    }


async def search_product(query: str, *, client: httpx.AsyncClient | None = None) -> Optional[dict]:
    """Search Amazon for a product and return the first result's info."""
    url = f"{BASE_URL}/s?k={quote_plus(query)}"
    own_client = client is None
    if own_client:
        client = httpx.AsyncClient(follow_redirects=True, timeout=15)
    try:
        resp = await client.get(url, headers=_headers())
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")

        # Find first product result
        results = soup.select('[data-component-type="s-search-result"]')
        if not results:
            return None

        first = results[0]
        asin = first.get("data-asin", "")
        title_el = first.select_one("h2 a span")
        title = title_el.get_text(strip=True) if title_el else query

        price_whole = first.select_one(".a-price-whole")
        price_frac = first.select_one(".a-price-fraction")
        price = None
        if price_whole:
            try:
                p = price_whole.get_text(strip=True).replace(",", "").rstrip(".")
                f = price_frac.get_text(strip=True) if price_frac else "00"
                price = float(f"{p}.{f}")
            except ValueError:
                pass

        rating_el = first.select_one('[aria-label*="out of 5 stars"]')
        rating = None
        if rating_el:
            m = re.search(r"([\d.]+) out of", rating_el.get("aria-label", ""))
            if m:
                rating = float(m.group(1))

        review_count_el = first.select_one('[aria-label*="ratings"]')
        review_count = 0
        if review_count_el:
            m = re.search(r"([\d,]+)", review_count_el.get("aria-label", ""))
            if m:
                review_count = int(m.group(1).replace(",", ""))

        img_el = first.select_one("img.s-image")
        image_url = img_el.get("src", "") if img_el else ""

        return {
            "asin": asin,
            "title": title,
            "price": price,
            "rating": rating,
            "review_count": review_count,
            "image_url": image_url,
            "url": f"{BASE_URL}/dp/{asin}" if asin else "",
        }
    except Exception:
        return None
    finally:
        if own_client:
            await client.aclose()


async def fetch_reviews(
    asin: str,
    *,
    max_pages: int = 3,
    client: httpx.AsyncClient | None = None,
) -> list[Review]:
    """Scrape reviews for a given ASIN, up to max_pages pages."""
    reviews: list[Review] = []
    own_client = client is None
    if own_client:
        client = httpx.AsyncClient(follow_redirects=True, timeout=15)
    try:
        for page in range(1, max_pages + 1):
            url = f"{BASE_URL}/product-reviews/{asin}?pageNumber={page}&sortBy=recent"
            await asyncio.sleep(random.uniform(1.0, 2.5))  # rate limit
            try:
                resp = await client.get(url, headers=_headers())
                resp.raise_for_status()
            except Exception:
                break

            soup = BeautifulSoup(resp.text, "lxml")
            review_divs = soup.select('[data-hook="review"]')
            if not review_divs:
                break

            for div in review_divs:
                # Rating
                star_el = div.select_one('[data-hook="review-star-rating"] span')
                rating = None
                if star_el:
                    m = re.search(r"([\d.]+)", star_el.get_text())
                    if m:
                        rating = float(m.group(1))

                # Author
                author_el = div.select_one(".a-profile-name")
                author = author_el.get_text(strip=True) if author_el else ""

                # Date
                date_el = div.select_one('[data-hook="review-date"]')
                date_text = date_el.get_text(strip=True) if date_el else ""

                # Body
                body_el = div.select_one('[data-hook="review-body"]')
                body = body_el.get_text(strip=True) if body_el else ""

                # Verified
                verified_el = div.select_one('[data-hook="avp-badge"]')
                verified = verified_el is not None

                # Helpful votes
                helpful_el = div.select_one('[data-hook="helpful-vote-statement"]')
                helpful = 0
                if helpful_el:
                    m = re.search(r"(\d+)", helpful_el.get_text())
                    if m:
                        helpful = int(m.group(1))

                # Photos
                photo_els = div.select('[data-hook="review-image-tile"]')
                photos = []
                for img in photo_els:
                    src = img.get("src", "")
                    if src:
                        photos.append(src)

                if body:
                    reviews.append(Review(
                        source=SourceType.AMAZON,
                        author=author,
                        rating=rating,
                        text=body,
                        date=date_text,
                        helpful_votes=helpful,
                        verified_purchase=verified,
                        photo_urls=photos,
                    ))
    finally:
        if own_client:
            await client.aclose()

    return reviews
