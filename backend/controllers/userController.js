const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
  const { email, fullName, password, confirmPassword, phone } = req.body;

  // Validate request data
  if (!email || !fullName || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already taken.' });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    fullName,
    password: hashedPassword,
    phone,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate request data
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // If user doesn't exist
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
  
      // If passwords don't match
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send success response with token
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

  module.exports = {
    registerUser,
    loginUser
  };