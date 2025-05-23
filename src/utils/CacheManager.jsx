export const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const cacheManager = {
  set: (key, data) => {
    const cacheItem = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  },

  get: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();

    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  clear: (key) => {
    localStorage.removeItem(key);
  }
};

export const CACHE_KEYS = {
  ALL_MONSTERS: 'all_monsters',
  ALL_SKILLS: 'all_skills',
  HERO_CARDS: (hero, size) => `hero_cards_${hero}_${size}`,
  ALL_CARDS: 'all_cards',
  MONSTER_BY_DAY: (day) => `monsters_day_${day}`
};