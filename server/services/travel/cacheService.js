/**
 * Simple In-Memory Cache Service with TTL support
 * Used for caching station search lookups, airport lookups, and static route responses.
 */
class TravelCacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get a cached item if present and not expired
   * @param {string} key 
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Set a cached item with TTL in seconds
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds Default 1 hour (3600s)
   */
  set(key, value, ttlSeconds = 3600) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  /**
   * Flush or clear cache
   */
  clear() {
    this.cache.clear();
  }
}

export const travelCache = new TravelCacheService();
