const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createStudent(req, res) {
  try {
    const student = req.body;
    const collection = db.getDb().collection('students');
    
    // Get the highest existing studentId
    const lastStudent = await collection.findOne({}, { sort: { studentId: -1 } });
    const nextId = (lastStudent?.studentId || 0) + 1;
    
    student.studentId = nextId;
    const result = await collection.insertOne(student);
    res.status(201).json({ ...student, _id: result.insertedId });
  } catch (error) {
    console.error('Failed to create student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
}

async function getStudent(req, res) {
  try {
    const { id } = req.params;
    
    // Try cache first
    const cachedStudent = await redisService.getCachedData(`student:${id}`);
    if (cachedStudent) {
      console.log('Student retrieved from cache');
      return res.status(200).json(cachedStudent);
    }

    const collection = db.getDb().collection('students');
    try {
      const student = await mongoService.findOneById(collection, id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      // Cache for future requests
      await redisService.cacheData(`student:${id}`, student, 3600);
      res.status(200).json(student);
    } catch (error) {
      if (error.message === 'Invalid ObjectId format') {
        return res.status(400).json({ error: 'Invalid student ID format' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to get student:', error);
    res.status(500).json({ error: 'Failed to get student' });
  }
}

async function getAllStudents(req, res) {
  try {
    const collection = db.getDb().collection('students');
    const students = await collection.find({}).toArray();
    res.status(200).json(students);
  } catch (error) {
    console.error('Failed to get students:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
}

async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const collection = db.getDb().collection('students');
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Invalidate cache
    await redisService.cacheData(`student:${id}`, result.value, 0);
    res.status(200).json(result.value);
  } catch (error) {
    console.error('Failed to update student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
}

module.exports = {
  createStudent,
  getStudent,
  getAllStudents,
  updateStudent
};
