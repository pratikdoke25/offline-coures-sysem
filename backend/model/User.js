const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    areaOfInterest: { type: String, required: true }, // Single dropdown field
    skills: [{ type: String, required: true }], // Array for multiple skills
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
