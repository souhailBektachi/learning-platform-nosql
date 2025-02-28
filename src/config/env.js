// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : 
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : 

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI',
  'MONGODB_USER',
  'MONGODB_PASSWORD',
  'REDIS_PASSWORD'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`La variable d'environnement ${varName} est manquante.`);
    }
  });
}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI,
    password: process.env.REDIS_PASSWORD
  },
  port: process.env.PORT || 3000
};