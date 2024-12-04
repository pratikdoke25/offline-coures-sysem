const express = require('express');
const { registerUser,loginUser ,getUserById} = require('../controllers/userController');
const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// Route to fetch user by ID
router.get('/:id', getUserById);

module.exports = router;
