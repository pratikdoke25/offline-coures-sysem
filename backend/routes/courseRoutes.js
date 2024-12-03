const express = require('express');
const { addCourse,getCoursesByTeacherId,getAllCourses,getCourseById } = require('../controllers/courseController');

const router = express.Router();

// POST route to add a course
router.post('/add', addCourse);
// Route to get courses by teacherId
router.get('/courses/teacher/:teacherId', getCoursesByTeacherId);
// Route to fetch all courses
router.get('/courses', getAllCourses);
// Route to get course by ID
router.get('/course/:courseId', getCourseById);
module.exports = router;
