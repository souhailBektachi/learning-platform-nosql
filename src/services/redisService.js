const db = require('../config/db');

// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl = 3600) {
  try {
    const redisClient = db.getRedisClient();
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    return true;
  } catch (error) {
    console.error('Redis cache error:', error);
    return false;
  }
}

async function getCachedData(key) {
  try {
    const redisClient = db.getRedisClient();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function testRedisConnection() {
  try {
    const redisClient = db.getRedisClient();
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