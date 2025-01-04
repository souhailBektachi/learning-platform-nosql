// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const course = req.body;
    const collection = db.getDb().collection('courses');
    
    const lastCourse = await collection.findOne({}, { sort: { courseId: -1 } });
    const nextId = (lastCourse?.courseId || 0) + 1;
    
    course.courseId = nextId;
    
    const result = await collection.insertOne(course);
    res.status(201).json({ ...course, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create course:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;
    
    const cachedCourse = await redisService.getCachedData(`course:${id}`);
    if (cachedCourse) {
      console.log('Course retrieved from cache');
      return res.status(200).json(cachedCourse);
    }

    const collection = db.getDb().collection('courses');
    try {
      const course = await mongoService.findOneById(collection, id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      await redisService.cacheData(`course:${id}`, course, 3600); 
      res.status(200).json(course);
    } catch (error) {
      if (error.message === 'Invalid ObjectId format') {
        return res.status(400).json({ error: 'Invalid course ID format' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to get course:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
}

async function getAllCourses(req, res) {
  try {
    const collection = db.getDb().collection('courses');
    const courses = await collection.find({}).toArray();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Failed to get courses:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
}

async function getCourseStats(req, res) {
  try {
    const collection = db.getDb().collection('courses');
    const stats = await collection.aggregate([
      { $group: { _id: null, totalCourses: { $sum: 1 } } }
    ]).toArray();
    res.status(200).json(stats[0] || { totalCourses: 0 });
  } catch (error) {
    console.error('Failed to get course stats:', error);
    res.status(500).json({ error: 'Failed to get course stats' });
  }
}

// Export des contrôleurs
module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
  getAllCourses  
};