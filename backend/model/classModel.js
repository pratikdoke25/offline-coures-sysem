const mongoose = require('mongoose');

// Define the Course schema
const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  instructorName: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
  },
  isEnrolled: {
    type: Boolean,
    default: false, // Defaults to false if not provided
  },
  skills: {
    type: [String], // Array of strings
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB user ID
    required: true,
    ref: 'User', // Reference to the User model
  },
  teacherEmail: {
    type: String,
    required: true, // Email of the instructor
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt fields
});

module.exports = mongoose.model('Course', CourseSchema);
