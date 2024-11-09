const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create User Schema
const teacherSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

// Password Hashing Middleware
teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
teacherSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);
