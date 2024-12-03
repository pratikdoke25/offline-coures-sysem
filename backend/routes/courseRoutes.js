const express = require('express');
const { addCourse,getCoursesByTeacherId } = require('../controllers/courseController');

const router = express.Router();

// POST route to add a course
router.post('/add', addCourse);
// Route to get courses by teacherId
router.get('/courses/teacher/:teacherId', getCoursesByTeacherId);
module.exports = router;
