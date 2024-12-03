const Course = require('../model/classModel'); // Assuming Course model is in the `models` folder

// Function to add a new course
const addCourse = async (req, res) => {
  try {
    const { courseName, description, price, skills, contact, instructorName, isEnrolled, userId, userEmail } = req.body;

    // Validate that instructorName and contact are provided
    if (!instructorName || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Instructor name and contact number are required.',
      });
    }

    // Create a new course object
    const newCourse = new Course({
      courseName,
      description,
      price,
      skills,
      contact,
      instructorName,
      isEnrolled, // Optional, if not provided, will default to false
      teacherId: userId, // Save the user ID from session
      teacherEmail: userEmail, // Save the user email from session
    });

    // Save the new course to the database
    const savedCourse = await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course added successfully!',
      data: savedCourse,
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the course.',
      error: error.message,
    });
  }
};

module.exports = { addCourse };
