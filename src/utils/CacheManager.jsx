import { API_CONFIG } from '../utils/API_Version';

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cached item has a version and if it matches current API version
    if (item.version !== API_CONFIG.API_VERSION) {
      this.clear(key);
      return null;
    }

    // Check if item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.clear(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttl = 3600000) { // Default TTL: 1 hour
    this.cache.set(key, {
      value,
      version: API_CONFIG.API_VERSION,
      expiry: ttl ? Date.now() + ttl : null
    });
  }

  clear(key) {
    this.cache.delete(key);
  }

  clearAll() {
    this.cache.clear();
  }

  // Method to check and clear outdated cache
  validateCache() {
    for (const [key, item] of this.cache.entries()) {
      if (item.version !== API_CONFIG.API_VERSION) {
        this.clear(key);
      }
    }
  }
}

export const CACHE_KEYS = {
  ALL_MONSTERS: 'all-monsters',
  ALL_SKILLS: 'all-skills',
  ALL_CARDS: 'all-cards',
  HERO_CARDS: (hero, size) => `hero-cards-${hero}-${size}`,
};

export const cacheManager = new CacheManager();

// Run cache validation on initialization
cacheManager.validateCache();