import { CACHE } from "./constants";

// Simple in-memory cache implementation
interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheItem<unknown>>;
  private defaultTTL: number;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(defaultTTL = CACHE.DEFAULT_TTL) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.cleanupInterval = null;
  }

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to store
   * @param ttl - Time to live in milliseconds (optional)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiry } as CacheItem<unknown>);
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    // Return undefined if item doesn't exist
    if (!item) return undefined;

    // Check if the item has expired
    if (Date.now() > item.expiry) {
      this.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Delete a value from the cache
   * @param key - Cache key
   * @returns true if the item was deleted, false otherwise
   */
  delete(key: string): boolean {
    // If the key contains a wildcard, delete all matching keys
    if (key.includes("*")) {
      const regex = new RegExp("^" + key.replace(/\*/g, ".*") + "$");
      let deleted = false;

      for (const cacheKey of this.cache.keys()) {
        if (regex.test(cacheKey)) {
          this.cache.delete(cacheKey);
          deleted = true;
        }
      }

      return deleted;
    }

    return this.cache.delete(key);
  }

  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get a value from the cache, or compute and store it if not present
   * @param key - Cache key
   * @param fn - Function to compute the value if not in cache
   * @param ttl - Time to live in milliseconds (optional)
   * @returns The cached or computed value
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cachedValue = this.get<T>(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await fn();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Automatically clean up expired items
   * @param interval - Cleanup interval in milliseconds (default: 5 minutes)
   */
  startCleanupInterval(interval = CACHE.CLEANUP_INTERVAL): NodeJS.Timeout {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          this.delete(key);
        }
      }
    }, interval);

    return this.cleanupInterval;
  }

  /**
   * Stop the cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Export a singleton instance
const cacheManager = new CacheManager();
export default cacheManager;
