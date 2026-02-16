"""Claude-powered product analysis engine.

Takes raw review/discussion data and produces structured analysis:
  - Fake review detection
  - Credibility-weighted summaries
  - Category-specific gotchas
  - Buy/skip/wait verdicts
  - Hype detection
"""

from __future__ import annotations

import json
import os
from typing import Optional

from backend.models.schemas import (
    ComparisonResult,
    FakeReviewAnalysis,
    ProductAnalysis,
    ProductCategory,
    Review,
    RedditPost,
    RiskAssessment,
    UserPreferences,
    Verdict,
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def _format_reviews_for_prompt(reviews: list[Review], limit: int = 50) -> str:
    lines = []
    for i, r in enumerate(reviews[:limit]):
        lines.append(
            f"[Review {i+1}] Rating: {r.rating}/5 | Verified: {r.verified_purchase} | "
            f"Helpful: {r.helpful_votes} | Date: {r.date}\n{r.text[:400]}"
        )
    return "\n\n".join(lines)


def _format_reddit_for_prompt(posts: list[RedditPost], limit: int = 15) -> str:
    lines = []
    for i, p in enumerate(posts[:limit]):
        comments_text = "\n  ".join(c[:200] for c in p.top_comments[:3])
        lines.append(
            f"[Reddit {i+1}] r/{p.subreddit} | Score: {p.score} | "
            f"Comments: {p.num_comments} | Credibility: {p.credibility_score:.1f}\n"
            f"Title: {p.title}\n{p.body[:300]}"
            + (f"\nTop comments:\n  {comments_text}" if comments_text else "")
        )
    return "\n\n".join(lines)


def _format_preferences(prefs: Optional[UserPreferences], category: str) -> str:
    if not prefs:
        return "No user preferences available."

    parts = []
    if prefs.global_priorities:
        parts.append(f"Global priorities: {', '.join(prefs.global_priorities)}")
    if prefs.global_dealbreakers:
        parts.append(f"Global dealbreakers: {', '.join(prefs.global_dealbreakers)}")

    cat_pref = prefs.category_preferences.get(category)
    if cat_pref:
        if cat_pref.priorities:
            parts.append(f"Category priorities: {', '.join(cat_pref.priorities)}")
        if cat_pref.dealbreakers:
            parts.append(f"Category dealbreakers: {', '.join(cat_pref.dealbreakers)}")
        parts.append(f"Price sensitivity: {cat_pref.price_sensitivity:.1f}/1.0")

    if prefs.sensitivity_profile:
        parts.append(f"Sensitivity profile: {json.dumps(prefs.sensitivity_profile)}")

    if prefs.purchase_history:
        recent = prefs.purchase_history[-5:]
        history_lines = []
        for ph in recent:
            history_lines.append(
                f"  - {ph.product_name} ({ph.category.value}): "
                f"satisfaction {ph.satisfaction_score}/5, "
                f"kept={ph.kept_product}"
            )
        parts.append("Recent purchase outcomes:\n" + "\n".join(history_lines))

    return "\n".join(parts) if parts else "No specific preferences set."


async def analyze_product(
    query: str,
    product_info: Optional[dict],
    reviews: list[Review],
    reddit_posts: list[RedditPost],
    category: ProductCategory,
    preferences: Optional[UserPreferences] = None,
) -> ProductAnalysis:
    """Run full Claude-powered analysis on collected product data."""

    product_name = product_info.get("title", query) if product_info else query
    price = product_info.get("price") if product_info else None
    overall_rating = product_info.get("rating") if product_info else None

    reviews_text = _format_reviews_for_prompt(reviews)
    reddit_text = _format_reddit_for_prompt(reddit_posts)
    prefs_text = _format_preferences(preferences, category.value)

    prompt = f"""You are a product research analyst. Analyze the following product data and provide a comprehensive, honest assessment.

PRODUCT: {product_name}
CATEGORY: {category.value}
PRICE: ${price:.2f} if price else "Unknown"
OVERALL RATING: {overall_rating}/5 if overall_rating else "Unknown"

USER PREFERENCES:
{prefs_text}

AMAZON REVIEWS ({len(reviews)} total):
{reviews_text if reviews_text else "No Amazon reviews collected."}

REDDIT DISCUSSIONS ({len(reddit_posts)} posts):
{reddit_text if reddit_text else "No Reddit discussions found."}

Please provide your analysis in the following JSON format:
{{
    "summary": "2-3 sentence overview of the product based on real user experiences",
    "pros": ["list", "of", "genuine", "pros"],
    "cons": ["list", "of", "genuine", "cons"],
    "fake_review_analysis": {{
        "fake_percentage_estimate": 0.0,
        "confidence": 0.0,
        "signals": ["specific signals you detected"],
        "adjusted_rating": 4.2
    }},
    "risk_assessment": {{
        "return_rate_estimate": "low/medium/high based on review patterns",
        "common_failures": ["specific failure modes mentioned"],
        "warranty_notes": "any warranty info found",
        "longevity_estimate": "how long users report it lasting"
    }},
    "hype_score": 0.0,
    "gotchas": ["things a buyer might not realize before purchase"],
    "verdict": "buy|skip|wait",
    "verdict_reasoning": "clear explanation of verdict",
    "confidence": 0.0,
    "alternatives": ["alternative products mentioned by reviewers"]
}}

IMPORTANT GUIDELINES:
- Be brutally honest. Don't sugarcoat issues.
- fake_percentage_estimate: Look for patterns like repetitive phrasing, all-5-star clusters, unverified purchases with generic praise, review timing clusters.
- hype_score: 0.0 = no hype (sustained quality), 1.0 = all hype (viral but poor quality).
- Weigh verified purchases and high-credibility Reddit posts more heavily.
- If user has preferences, personalize gotchas and verdict to their specific needs.
- confidence: How confident you are in your verdict (0-1). Lower if data is limited.
- For the verdict, "wait" means price is likely to drop or a better version is coming soon.
"""

    try:
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.content[0].text

        # Parse JSON from response (handle markdown code blocks)
        json_text = response_text
        if "```json" in json_text:
            json_text = json_text.split("```json")[1].split("```")[0]
        elif "```" in json_text:
            json_text = json_text.split("```")[1].split("```")[0]

        result = json.loads(json_text.strip())

    except Exception as e:
        # Fallback analysis when API is unavailable
        result = _fallback_analysis(reviews, reddit_posts, product_name)

    # Build the ProductAnalysis object
    fake_analysis = None
    if "fake_review_analysis" in result:
        fa = result["fake_review_analysis"]
        fake_analysis = FakeReviewAnalysis(
            fake_percentage_estimate=fa.get("fake_percentage_estimate", 0),
            confidence=fa.get("confidence", 0),
            signals=fa.get("signals", []),
            adjusted_rating=fa.get("adjusted_rating"),
        )

    risk = None
    if "risk_assessment" in result:
        ra = result["risk_assessment"]
        risk = RiskAssessment(
            return_rate_estimate=ra.get("return_rate_estimate"),
            common_failures=ra.get("common_failures", []),
            warranty_notes=ra.get("warranty_notes", ""),
            longevity_estimate=ra.get("longevity_estimate", ""),
        )

    verdict_str = result.get("verdict", "").lower()
    verdict = None
    if verdict_str in ("buy", "skip", "wait"):
        verdict = Verdict(verdict_str)

    return ProductAnalysis(
        query=query,
        product_name=product_name,
        category=category,
        overall_rating=overall_rating,
        price=price,
        amazon_reviews=reviews,
        reddit_posts=reddit_posts,
        summary=result.get("summary", ""),
        pros=result.get("pros", []),
        cons=result.get("cons", []),
        fake_review_analysis=fake_analysis,
        risk_assessment=risk,
        hype_score=result.get("hype_score"),
        gotchas=result.get("gotchas", []),
        verdict=verdict,
        verdict_reasoning=result.get("verdict_reasoning", ""),
        confidence=result.get("confidence", 0),
        alternatives=result.get("alternatives", []),
        sources_analyzed={
            "amazon_reviews": len(reviews),
            "reddit_posts": len(reddit_posts),
        },
    )


def _fallback_analysis(
    reviews: list[Review],
    reddit_posts: list[RedditPost],
    product_name: str,
) -> dict:
    """Generate a basic analysis without the Claude API."""

    avg_rating = 0.0
    if reviews:
        ratings = [r.rating for r in reviews if r.rating is not None]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0

    verified_count = sum(1 for r in reviews if r.verified_purchase)
    total = len(reviews) or 1

    # Simple fake detection heuristic
    five_stars = sum(1 for r in reviews if r.rating and r.rating >= 4.5)
    one_stars = sum(1 for r in reviews if r.rating and r.rating <= 1.5)
    fake_pct = 0.0
    if total > 10:
        # Suspicious if >80% are 5-star with few verified
        if five_stars / total > 0.8 and verified_count / total < 0.5:
            fake_pct = 30.0

    # Extract common themes from reddit
    reddit_summary = ""
    if reddit_posts:
        titles = [p.title for p in reddit_posts[:5]]
        reddit_summary = f"Discussed in Reddit posts: {'; '.join(titles)}"

    verdict = "buy" if avg_rating >= 4.0 else ("skip" if avg_rating < 3.0 else "wait")

    return {
        "summary": (
            f"{product_name} has an average rating of {avg_rating:.1f}/5 across {len(reviews)} reviews. "
            f"{verified_count}/{total} are verified purchases. {reddit_summary}"
        ),
        "pros": ["Unable to perform detailed analysis without API key"],
        "cons": ["Set ANTHROPIC_API_KEY for full analysis"],
        "fake_review_analysis": {
            "fake_percentage_estimate": fake_pct,
            "confidence": 0.3,
            "signals": ["Basic heuristic analysis only - set API key for detailed detection"],
            "adjusted_rating": avg_rating * (1 - fake_pct / 200),
        },
        "risk_assessment": {
            "return_rate_estimate": "unknown",
            "common_failures": [],
            "warranty_notes": "",
            "longevity_estimate": "unknown",
        },
        "hype_score": None,
        "gotchas": ["Full analysis requires ANTHROPIC_API_KEY"],
        "verdict": verdict,
        "verdict_reasoning": f"Based on average rating of {avg_rating:.1f}/5 (basic heuristic, no AI analysis)",
        "confidence": 0.3,
        "alternatives": [],
    }


async def compare_products(
    analyses: list[ProductAnalysis],
    preferences: Optional[UserPreferences] = None,
    priorities: list[str] | None = None,
) -> ComparisonResult:
    """Compare 2-3 products head-to-head using Claude."""

    products_text = ""
    for i, a in enumerate(analyses):
        products_text += f"""
--- PRODUCT {i+1}: {a.product_name} ---
Price: ${a.price:.2f} if a.price else "Unknown"
Rating: {a.overall_rating}/5
Verdict: {a.verdict.value if a.verdict else "N/A"} (confidence: {a.confidence:.0%})
Summary: {a.summary}
Pros: {', '.join(a.pros)}
Cons: {', '.join(a.cons)}
Gotchas: {', '.join(a.gotchas)}
Hype score: {a.hype_score}
Fake review %: {a.fake_review_analysis.fake_percentage_estimate if a.fake_review_analysis else 'N/A'}
"""

    pref_text = ""
    if preferences:
        pref_text = _format_preferences(preferences, analyses[0].category.value if analyses else "other")

    priority_text = ""
    if priorities:
        priority_text = f"User's stated priorities for this comparison: {', '.join(priorities)}"

    prompt = f"""Compare these products head-to-head and provide a clear recommendation.

{products_text}

USER PREFERENCES:
{pref_text}
{priority_text}

Respond in JSON:
{{
    "head_to_head": {{
        "build_quality": "Product X - reason",
        "value_for_money": "Product Y - reason",
        "durability": "...",
        "user_satisfaction": "...",
        "... other relevant dimensions": "..."
    }},
    "recommendation": "Product name to buy",
    "reasoning": "2-3 sentences explaining why, personalized to user preferences if available"
}}
"""

    try:
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]

        result = json.loads(text.strip())
    except Exception:
        # Fallback: pick highest rated
        best = max(analyses, key=lambda a: a.confidence)
        result = {
            "head_to_head": {
                "overall": f"{best.product_name} has highest confidence score"
            },
            "recommendation": best.product_name,
            "reasoning": "Based on confidence scores (AI comparison unavailable - set ANTHROPIC_API_KEY)",
        }

    return ComparisonResult(
        products=analyses,
        head_to_head=result.get("head_to_head", {}),
        recommendation=result.get("recommendation", ""),
        reasoning=result.get("reasoning", ""),
        based_on_preferences=preferences is not None,
    )
