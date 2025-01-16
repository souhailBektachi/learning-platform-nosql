// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?

require('dotenv').config();
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    await db.connectMongo();
    await db.connectRedis();
    
    // Test Redis connection
    const redisService = require('./services/redisService');
    const redisConnected = await redisService.testRedisConnection();
    if (!redisConnected) {
      throw new Error('Redis connection test failed');
    }

    app.use(express.json());
    app.use('/courses', courseRoutes);
    app.use('/students', studentRoutes);

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  await db.closeConnection();
  process.exit(0);
});

startServer();