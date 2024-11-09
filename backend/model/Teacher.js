const mongoose = require('mongoose');

// Create Teacher Schema
const teacherSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

// Compare password method
// Directly compares plain text passwords (no hashing)
teacherSchema.methods.matchPassword = function (password) {
  return password === this.password;
};

module.exports = mongoose.model('Teacher', teacherSchema);
