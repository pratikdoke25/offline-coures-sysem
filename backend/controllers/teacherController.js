const bcrypt = require('bcryptjs');
const Teacher = require('../model/Teacher');

// Register a new teacher
const registerTeacher = async (req, res) => {
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
  const existingUser = await Teacher.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already taken.' });
  }

  // Create a new teacher with hashed password
  const newTeacher = new Teacher({
    email,
    fullName,
    password,
    phone,
  });

  try {
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login teacher
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  // Validate request data
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    // Find the teacher by email
    const teacher = await Teacher.findOne({ email });  // Use correct model `Teacher`

    // If teacher doesn't exist
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the password using matchPassword method
    const isMatch = await teacher.matchPassword(password);

    // If passwords don't match
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Send success response with teacher data
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: teacher._id,
        email: teacher.email,
        name: teacher.fullName,  // Correct property
      },
    });
  } catch (error) {
    console.error(error);  // Log error for debugging
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

module.exports = { loginTeacher, registerTeacher };
