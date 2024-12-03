const express = require('express');
const { registerTeacher,loginTeacher,getTeacherById } = require('../controllers/teacherController');
const router = express.Router();

// POST /api/users/register
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
// Route to get a teacher by ID
router.get('/all/:id', getTeacherById);
module.exports = router;
