const Enrollment = require('../model/enrollmentModel');

exports.enrollUser = async (req, res) => {
  try {
    const { email, userId, courseId } = req.body;

    // Check if the user is already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({ email, courseId });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // Create a new enrollment entry
    const enrollment = new Enrollment({
      email,
      userId,
      courseId,
      isEnrolled: true, // set to true as the user is enrolling now
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Successfully enrolled in the course!',
      enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.enrollred=async (req, res) => {
    const { userId, email } = req.query;

    try {
        const courses = await Course.find({ userId, isEnrolled: true }); // Query to fetch courses
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    // Fetch all enrollments
    const enrollments = await Enrollment.find();
    
    // Check if data exists
    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No enrollments found.',
      });
    }

    // Return the data
    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};