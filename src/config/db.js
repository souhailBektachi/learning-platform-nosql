// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : 

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  try {
    mongoClient = new MongoClient(config.mongodb.uri, {
      auth:{
        username: process.env.MONGODB_USER,
        password : process.env.MONGODB_PASSWORD
      },
      retryWrites: true,
      maxPoolSize: 50,
    });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connected to MongoDB');  
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;}
  

}

async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: config.redis.uri,
      password: config.redis.password,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Redis connection retries exhausted');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    await redisClient.connect();
    
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
    
    redisClient.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    // Test authentication
    await redisClient.ping();
    console.log('Redis authentication successful');

    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  getDb: () => db,
  getRedisClient: () => redisClient,
  closeConnection: async () => {
    if (mongoClient) await mongoClient.close();
    if (redisClient) await redisClient.quit();
  }
};