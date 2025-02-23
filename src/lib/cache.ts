import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Cache time: 24 hours (in seconds)
const CACHE_TIME = 24 * 60 * 60;

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    // Try to get data from cache
    const cached = await redis.get(key);
    if (cached) {
      console.log(`Cache hit for key: ${key}`);
      return cached as T;
    }

    // If not in cache, fetch fresh data
    console.log(`Cache miss for key: ${key}`);
    const freshData = await fetcher();

    // Store in cache
    await redis.setex(key, CACHE_TIME, freshData);

    return freshData;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);
    // If cache fails, fall back to fetcher
    return fetcher();
  }
}

// Function to clear cache for a specific key
export async function clearCache(key: string): Promise<void> {
  try {
    await redis.del(key);
    console.log(`Cleared cache for key: ${key}`);
  } catch (error) {
    console.error(`Error clearing cache for key ${key}:`, error);
  }
}

// Function to clear all cache (use with caution)
export async function clearAllCache(): Promise<void> {
  try {
    await redis.flushall();
    console.log('Cleared all cache');
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
} 