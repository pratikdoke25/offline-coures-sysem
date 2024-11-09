const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

// No hashing or comparison of password anymore, so these are removed
module.exports = mongoose.model('User', userSchema);
