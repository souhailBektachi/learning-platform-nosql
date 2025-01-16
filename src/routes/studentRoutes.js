const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student routes
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudent);

module.exports = router;
