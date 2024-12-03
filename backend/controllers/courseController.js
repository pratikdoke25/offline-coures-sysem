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

// Function to get courses by teacherId
const getCoursesByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Validate teacherId
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required.',
      });
    }

    // Find courses by teacherId
    const courses = await Course.find({ teacherId });

    // Check if courses exist
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses found for the given teacher ID.',
      });
    }

    // Respond with courses
    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully!',
      data: courses,
    });
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving courses.',
      error: error.message,
    });
  }
};
module.exports = { addCourse,getCoursesByTeacherId };
