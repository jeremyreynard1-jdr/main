"""Pydantic models for request/response schemas and internal data structures."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class ProductCategory(str, Enum):
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"
    KITCHEN = "kitchen"
    CLOTHING = "clothing"
    BEAUTY = "beauty"
    SPORTS = "sports"
    TOYS = "toys"
    SERVICES = "services"
    OTHER = "other"


class Verdict(str, Enum):
    BUY = "buy"
    SKIP = "skip"
    WAIT = "wait"


class SourceType(str, Enum):
    AMAZON = "amazon"
    REDDIT = "reddit"
    YOUTUBE = "youtube"
    PROFESSIONAL = "professional"
    PRICE_TRACKER = "price_tracker"


# ---------------------------------------------------------------------------
# Review / source data
# ---------------------------------------------------------------------------

class Review(BaseModel):
    source: SourceType
    author: str = ""
    rating: Optional[float] = None
    text: str = ""
    date: Optional[str] = None
    helpful_votes: int = 0
    verified_purchase: bool = False
    photo_urls: list[str] = Field(default_factory=list)
    credibility_score: Optional[float] = None  # 0-1


class RedditPost(BaseModel):
    subreddit: str
    title: str
    url: str
    score: int = 0
    num_comments: int = 0
    author: str = ""
    author_karma: Optional[int] = None
    account_age_days: Optional[int] = None
    credibility_score: Optional[float] = None
    body: str = ""
    top_comments: list[str] = Field(default_factory=list)


class YouTubeTimestamp(BaseModel):
    video_id: str
    video_title: str
    channel: str
    timestamp_seconds: int
    label: str
    url: str


class PricePoint(BaseModel):
    date: str
    price: float
    source: str = "amazon"


# ---------------------------------------------------------------------------
# Analysis results
# ---------------------------------------------------------------------------

class FakeReviewAnalysis(BaseModel):
    fake_percentage_estimate: float = 0.0
    confidence: float = 0.0
    signals: list[str] = Field(default_factory=list)
    adjusted_rating: Optional[float] = None


class RiskAssessment(BaseModel):
    return_rate_estimate: Optional[str] = None
    common_failures: list[str] = Field(default_factory=list)
    warranty_notes: str = ""
    longevity_estimate: str = ""


class ProductAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    query: str
    product_name: str = ""
    category: ProductCategory = ProductCategory.OTHER
    overall_rating: Optional[float] = None
    price: Optional[float] = None
    price_currency: str = "USD"

    # Sources
    amazon_reviews: list[Review] = Field(default_factory=list)
    reddit_posts: list[RedditPost] = Field(default_factory=list)
    youtube_timestamps: list[YouTubeTimestamp] = Field(default_factory=list)
    price_history: list[PricePoint] = Field(default_factory=list)

    # AI analysis
    summary: str = ""
    pros: list[str] = Field(default_factory=list)
    cons: list[str] = Field(default_factory=list)
    fake_review_analysis: Optional[FakeReviewAnalysis] = None
    risk_assessment: Optional[RiskAssessment] = None
    hype_score: Optional[float] = None  # 0-1, how much is hype vs sustained quality
    gotchas: list[str] = Field(default_factory=list)

    # Verdict
    verdict: Optional[Verdict] = None
    verdict_reasoning: str = ""
    confidence: float = 0.0  # 0-1
    alternatives: list[str] = Field(default_factory=list)

    # Meta
    sources_analyzed: dict[str, int] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

class ComparisonResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    products: list[ProductAnalysis] = Field(default_factory=list)
    head_to_head: dict[str, str] = Field(default_factory=dict)  # dimension -> winner
    recommendation: str = ""
    reasoning: str = ""
    based_on_preferences: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ---------------------------------------------------------------------------
# User preferences
# ---------------------------------------------------------------------------

class CategoryPreference(BaseModel):
    priorities: list[str] = Field(default_factory=list)  # e.g. ["durability", "price"]
    dealbreakers: list[str] = Field(default_factory=list)
    price_sensitivity: float = 0.5  # 0=don't care, 1=very price sensitive
    brand_preferences: list[str] = Field(default_factory=list)
    brand_avoidances: list[str] = Field(default_factory=list)
    notes: str = ""


class PurchaseOutcome(BaseModel):
    product_name: str
    category: ProductCategory
    purchase_date: str
    satisfaction_score: int = 0  # 1-5
    kept_product: bool = True
    notes: str = ""
    what_mattered_most: list[str] = Field(default_factory=list)


class UserPreferences(BaseModel):
    user_id: str = "default"
    category_preferences: dict[str, CategoryPreference] = Field(default_factory=dict)
    purchase_history: list[PurchaseOutcome] = Field(default_factory=list)
    global_priorities: list[str] = Field(default_factory=list)
    global_dealbreakers: list[str] = Field(default_factory=list)
    sensitivity_profile: dict[str, float] = Field(default_factory=dict)
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ---------------------------------------------------------------------------
# Saved / tracked items
# ---------------------------------------------------------------------------

class SavedProduct(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_name: str
    query: str
    analysis_id: str
    target_price: Optional[float] = None
    notes: str = ""
    status: str = "considering"  # considering, purchased, passed
    added_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ---------------------------------------------------------------------------
# API request / response
# ---------------------------------------------------------------------------

class ResearchRequest(BaseModel):
    query: str
    category: Optional[ProductCategory] = None
    max_reviews: int = 100
    include_reddit: bool = True
    include_youtube: bool = False
    include_price_history: bool = False


class CompareRequest(BaseModel):
    products: list[str]  # 2-3 product queries
    category: Optional[ProductCategory] = None
    priorities: list[str] = Field(default_factory=list)


class PreferenceUpdate(BaseModel):
    category: str
    priorities: list[str] = Field(default_factory=list)
    dealbreakers: list[str] = Field(default_factory=list)
    price_sensitivity: Optional[float] = None


class SatisfactionSurvey(BaseModel):
    product_name: str
    category: ProductCategory
    satisfaction_score: int  # 1-5
    kept_product: bool = True
    notes: str = ""
    what_mattered_most: list[str] = Field(default_factory=list)


class AnalysisProgress(BaseModel):
    stage: str
    detail: str
    progress: float  # 0-1
