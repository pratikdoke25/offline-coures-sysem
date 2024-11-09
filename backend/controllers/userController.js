const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  const { email, fullName, password, confirmPassword, phone } = req.body;

  if (!email || !fullName || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already taken.' });
  }

  // Create a new user without password hashing
  const newUser = new User({
    email,
    fullName,
    password,
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

  try {
    // Check if email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches (direct comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token and user info
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
