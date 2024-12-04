const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: false, // review is not required
  },
  isEnrolled: {
    type: Boolean,
    default: false, // default to false
  },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
