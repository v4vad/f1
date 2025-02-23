import { Redis } from '@upstash/redis';

// Cache time: 24 hours (in seconds)
const CACHE_TIME = 24 * 60 * 60;

// Initialize Redis client lazily
let redis: Redis | null = null;

async function getRedisClient() {
  if (redis) return redis;
  
  // Check if we're in a static build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // We're in a static build, return null
    return null;
  }

  if (!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || !process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Redis credentials not found, skipping cache initialization');
    return null;
  }

  redis = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
  });

  return redis;
}

// Verify Redis connection
async function verifyRedisConnection() {
  const client = await getRedisClient();
  if (!client) {
    console.warn('Redis client not available, skipping connection verification');
    return;
  }

  try {
    await client.ping();
    console.log('✅ Redis connection successful');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    // Don't throw error, just log it
  }
}

// Verify connection on startup
verifyRedisConnection().catch(console.error);

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const client = await getRedisClient();
  
  // If no Redis client, fall back to direct fetching
  if (!client) {
    console.log(`⚠️ Redis not available, falling back to direct fetch for key: ${key}`);
    return fetcher();
  }

  try {
    console.log(`🔍 Checking cache for key: ${key}`);
    // Try to get data from cache
    const cached = await client.get(key);
    if (cached) {
      console.log(`✅ Cache hit for key: ${key}`);
      return cached as T;
    }

    // If not in cache, fetch fresh data
    console.log(`❌ Cache miss for key: ${key}, fetching fresh data...`);
    const freshData = await fetcher();

    // Store in cache
    console.log(`💾 Storing data in cache for key: ${key}`);
    await client.setex(key, CACHE_TIME, freshData);

    return freshData;
  } catch (error) {
    console.error(`⚠️ Cache error for key ${key}:`, error);
    // If cache fails, fall back to fetcher
    console.log(`↩️ Falling back to direct API call for key: ${key}`);
    return fetcher();
  }
}

// Function to clear cache for a specific key
export async function clearCache(key: string): Promise<void> {
  const client = await getRedisClient();
  if (!client) {
    console.warn(`Redis not available, skipping cache clear for key: ${key}`);
    return;
  }

  try {
    await client.del(key);
    console.log(`🗑️ Cleared cache for key: ${key}`);
  } catch (error) {
    console.error(`⚠️ Error clearing cache for key ${key}:`, error);
  }
}

// Function to clear all cache (use with caution)
export async function clearAllCache(): Promise<void> {
  const client = await getRedisClient();
  if (!client) {
    console.warn('Redis not available, skipping clear all cache');
    return;
  }

  try {
    await client.flushall();
    console.log('🗑️ Cleared all cache');
  } catch (error) {
    console.error('⚠️ Error clearing all cache:', error);
  }
} 