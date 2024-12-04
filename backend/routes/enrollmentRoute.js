const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// POST route to enroll the user
router.post('/enroll', enrollmentController.enrollUser);
router.get('/enrolled-courses',enrollmentController.enrollred)
module.exports = router;
