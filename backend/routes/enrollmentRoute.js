const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// POST route to enroll the user
router.post('/enroll', enrollmentController.enrollUser);
// router.get('/enrolled-courses',enrollmentController.enrollred)
router.get('/enrolled-courses',enrollmentController.getAllEnrollments)
module.exports = router;
