// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ObjectId format');
  }

  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }
    const objectId = new ObjectId(id);
    const result = await collection.findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Failed to find document by ID:', error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById
};