"""User preference storage and learning system.

Stores preferences as JSON files for simplicity.
Tracks category-specific priorities, dealbreakers, purchase outcomes,
and learns sensitivity profiles from satisfaction data.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

from backend.models.schemas import (
    CategoryPreference,
    ProductCategory,
    PurchaseOutcome,
    SatisfactionSurvey,
    UserPreferences,
)

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
PREFS_FILE = DATA_DIR / "preferences.json"
HISTORY_FILE = DATA_DIR / "search_history.json"
SAVED_FILE = DATA_DIR / "saved_products.json"


def _ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_preferences(user_id: str = "default") -> UserPreferences:
    """Load user preferences from disk."""
    _ensure_data_dir()
    if PREFS_FILE.exists():
        try:
            data = json.loads(PREFS_FILE.read_text())
            return UserPreferences(**data)
        except Exception:
            pass
    return UserPreferences(user_id=user_id)


def save_preferences(prefs: UserPreferences) -> None:
    """Persist preferences to disk."""
    _ensure_data_dir()
    from datetime import datetime
    prefs.updated_at = datetime.utcnow().isoformat()
    PREFS_FILE.write_text(prefs.model_dump_json(indent=2))


def update_category_preferences(
    category: str,
    priorities: list[str] | None = None,
    dealbreakers: list[str] | None = None,
    price_sensitivity: float | None = None,
) -> UserPreferences:
    """Update preferences for a specific product category."""
    prefs = load_preferences()

    cat_pref = prefs.category_preferences.get(category, CategoryPreference())

    if priorities is not None:
        cat_pref.priorities = priorities
    if dealbreakers is not None:
        cat_pref.dealbreakers = dealbreakers
    if price_sensitivity is not None:
        cat_pref.price_sensitivity = price_sensitivity

    prefs.category_preferences[category] = cat_pref
    save_preferences(prefs)
    return prefs


def record_purchase_outcome(survey: SatisfactionSurvey) -> UserPreferences:
    """Record a purchase outcome and update the sensitivity profile."""
    prefs = load_preferences()

    outcome = PurchaseOutcome(
        product_name=survey.product_name,
        category=survey.category,
        purchase_date="",  # Will be set by the caller
        satisfaction_score=survey.satisfaction_score,
        kept_product=survey.kept_product,
        notes=survey.notes,
        what_mattered_most=survey.what_mattered_most,
    )
    prefs.purchase_history.append(outcome)

    # Update sensitivity profile based on what mattered
    _update_sensitivity(prefs, survey)

    save_preferences(prefs)
    return prefs


def _update_sensitivity(prefs: UserPreferences, survey: SatisfactionSurvey) -> None:
    """Learn sensitivity from purchase outcomes.

    If a user is consistently dissatisfied and cites specific factors,
    bump those factors' sensitivity scores.
    """
    for factor in survey.what_mattered_most:
        current = prefs.sensitivity_profile.get(factor, 0.5)
        if survey.satisfaction_score >= 4:
            # Happy purchase, factor mattered positively
            prefs.sensitivity_profile[factor] = min(1.0, current + 0.05)
        elif survey.satisfaction_score <= 2:
            # Unhappy purchase, factor was a problem
            prefs.sensitivity_profile[factor] = min(1.0, current + 0.15)

    # Track if user is pickier than average in a category
    cat = survey.category.value
    cat_outcomes = [
        o for o in prefs.purchase_history
        if o.category.value == cat
    ]
    if len(cat_outcomes) >= 3:
        avg_sat = sum(o.satisfaction_score for o in cat_outcomes) / len(cat_outcomes)
        # Below 3.5 average = picky in this category
        pickiness = max(0, (3.5 - avg_sat) / 3.5)
        prefs.sensitivity_profile[f"_pickiness_{cat}"] = round(pickiness, 2)


# ---------------------------------------------------------------------------
# Search history
# ---------------------------------------------------------------------------

def save_search(query: str, analysis_id: str, product_name: str) -> None:
    """Append a search to history."""
    _ensure_data_dir()
    history = load_search_history()
    from datetime import datetime
    history.append({
        "query": query,
        "analysis_id": analysis_id,
        "product_name": product_name,
        "timestamp": datetime.utcnow().isoformat(),
    })
    # Keep last 200
    history = history[-200:]
    HISTORY_FILE.write_text(json.dumps(history, indent=2))


def load_search_history() -> list[dict]:
    _ensure_data_dir()
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text())
        except Exception:
            pass
    return []


# ---------------------------------------------------------------------------
# Saved / considering products
# ---------------------------------------------------------------------------

def save_product_to_list(product: dict) -> None:
    _ensure_data_dir()
    saved = load_saved_products()
    saved.append(product)
    SAVED_FILE.write_text(json.dumps(saved, indent=2))


def load_saved_products() -> list[dict]:
    _ensure_data_dir()
    if SAVED_FILE.exists():
        try:
            return json.loads(SAVED_FILE.read_text())
        except Exception:
            pass
    return []


def remove_saved_product(product_id: str) -> bool:
    saved = load_saved_products()
    new_saved = [p for p in saved if p.get("id") != product_id]
    if len(new_saved) < len(saved):
        SAVED_FILE.write_text(json.dumps(new_saved, indent=2))
        return True
    return False
