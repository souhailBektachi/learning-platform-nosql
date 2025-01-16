const db = require('../config/db');

// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl = 3600) {
  try {
    const redisClient = db.getRedisClient();
    if (!redisClient?.isOpen) {
      console.log('Redis client not connected');
      return false;
    }
    const serialized = JSON.stringify(data);
    if (ttl > 0) {
      await redisClient.setEx(key, ttl, serialized);
    } else {
      await redisClient.del(key); // For cache invalidation
    }
    console.log(`Cached data for key: ${key}`);
    return true;
  } catch (error) {
    console.error('Redis cache error:', error);
    return false;
  }
}

async function getCachedData(key) {
  try {
    const redisClient = db.getRedisClient();
    if (!redisClient?.isOpen) {
      console.log('Redis client not connected');
      return null;
    }
    const data = await redisClient.get(key);
    if (data) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(data);
    }
    console.log(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function testRedisConnection() {
  try {
    const redisClient = db.getRedisClient();
    if (!redisClient?.isOpen) {
      throw new Error('Redis client not connected');
    }
    await redisClient.set('test', 'Redis is working!');
    const testResult = await redisClient.get('test');
    console.log('Redis test result:', testResult);
    return testResult === 'Redis is working!';
  } catch (error) {
    console.error('Redis test failed:', error);
    return false;
  }
}

module.exports = {
  cacheData,
  getCachedData,
  testRedisConnection
};