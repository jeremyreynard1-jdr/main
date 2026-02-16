"""Simple in-memory cache with TTL support.  Swap for Redis later."""

from __future__ import annotations

import hashlib
import json
import time
from typing import Any, Optional


class SimpleCache:
    """Thread-safe-ish dict cache with per-key TTL."""

    def __init__(self, default_ttl: int = 3600):
        self._store: dict[str, tuple[float, Any]] = {}
        self._default_ttl = default_ttl

    def _key(self, raw: str) -> str:
        return hashlib.sha256(raw.encode()).hexdigest()

    def get(self, key: str) -> Optional[Any]:
        hk = self._key(key)
        entry = self._store.get(hk)
        if entry is None:
            return None
        expires, value = entry
        if time.time() > expires:
            del self._store[hk]
            return None
        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        hk = self._key(key)
        self._store[hk] = (time.time() + (ttl or self._default_ttl), value)

    def invalidate(self, key: str) -> None:
        hk = self._key(key)
        self._store.pop(hk, None)

    def clear(self) -> None:
        self._store.clear()

    @property
    def size(self) -> int:
        return len(self._store)


# Singleton instances
product_cache = SimpleCache(default_ttl=1800)   # 30 min for product data
analysis_cache = SimpleCache(default_ttl=3600)   # 1 hr for analysis results
