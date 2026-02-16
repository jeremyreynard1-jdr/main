"""API routes for user preferences, saved products, and satisfaction surveys."""

from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException

from backend.models.schemas import (
    PreferenceUpdate,
    SatisfactionSurvey,
    SavedProduct,
    UserPreferences,
)
from backend.services.preferences import (
    load_preferences,
    load_saved_products,
    record_purchase_outcome,
    remove_saved_product,
    save_preferences,
    save_product_to_list,
    update_category_preferences,
)

router = APIRouter(prefix="/api/preferences", tags=["preferences"])


@router.get("/")
async def get_preferences() -> dict:
    """Get all user preferences."""
    prefs = load_preferences()
    return prefs.model_dump()


@router.post("/category")
async def update_category(update: PreferenceUpdate) -> dict:
    """Update preferences for a specific product category."""
    prefs = update_category_preferences(
        category=update.category,
        priorities=update.priorities or None,
        dealbreakers=update.dealbreakers or None,
        price_sensitivity=update.price_sensitivity,
    )
    return {"status": "updated", "preferences": prefs.model_dump()}


@router.post("/global")
async def update_global(data: dict) -> dict:
    """Update global priorities and dealbreakers."""
    prefs = load_preferences()
    if "priorities" in data:
        prefs.global_priorities = data["priorities"]
    if "dealbreakers" in data:
        prefs.global_dealbreakers = data["dealbreakers"]
    save_preferences(prefs)
    return {"status": "updated", "preferences": prefs.model_dump()}


@router.post("/satisfaction")
async def record_satisfaction(survey: SatisfactionSurvey) -> dict:
    """Record a purchase outcome to improve future recommendations."""
    prefs = record_purchase_outcome(survey)
    return {
        "status": "recorded",
        "sensitivity_profile": prefs.sensitivity_profile,
        "message": "Thanks! This helps improve future recommendations.",
    }


@router.get("/sensitivity")
async def get_sensitivity() -> dict:
    """Get the learned sensitivity profile."""
    prefs = load_preferences()
    return {
        "sensitivity_profile": prefs.sensitivity_profile,
        "purchase_count": len(prefs.purchase_history),
        "categories_tracked": list(prefs.category_preferences.keys()),
    }


# ---------------------------------------------------------------------------
# Saved / considering products
# ---------------------------------------------------------------------------

@router.get("/saved")
async def get_saved() -> list[dict]:
    """Get all saved/considering products."""
    return load_saved_products()


@router.post("/saved")
async def save_product(product: dict) -> dict:
    """Add a product to the considering list."""
    save_product_to_list(product)
    return {"status": "saved"}


@router.delete("/saved/{product_id}")
async def delete_saved(product_id: str) -> dict:
    """Remove a product from the saved list."""
    removed = remove_saved_product(product_id)
    if not removed:
        raise HTTPException(404, "Product not found")
    return {"status": "removed"}
