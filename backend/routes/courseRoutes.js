const express = require('express');
const { addCourse } = require('../controllers/courseController');

const router = express.Router();

// POST route to add a course
router.post('/add', addCourse);

module.exports = router;
