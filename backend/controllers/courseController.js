const Course = require('../model/classModel'); // Import the Course model

// Function to add a new course
const addCourse = async (req, res) => {
  try {
    // Extract course data from the request body
    const { 
      courseName, 
      description, 
      price, 
      skills, 
      contactNumber, 
      instructorName, 
      userId, 
      userEmail 
    } = req.body;

    // Validate required fields
    if (!courseName || !description || !price || !contactNumber || !instructorName || !userId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided.',
      });
    }

    // Create a new course object with the provided data
    const newCourse = new Course({
      courseName,
      description,
      price,
      skills,
      contact: contactNumber,
      instructorName,
      teacherId: userId, // Save the user ID from the request
      teacherEmail: userEmail, // Save the user email from the request
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    // Send a success response
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
