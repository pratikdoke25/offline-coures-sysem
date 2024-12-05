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
//fetch all the details
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses', error });
  }
};

const getCourseById = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Find course by ID
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Return course data
    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
};


// Update course rating
const updateCourseRating = async (req, res) => {
  const { courseId, newRating } = req.body;

  if (!courseId || newRating == null) {
    return res.status(400).json({ message: "Course ID and new rating are required." });
  }

  if (newRating < 0 || newRating > 5) {
    return res.status(400).json({ message: "Rating must be between 0 and 5." });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Update the rating
    course.rating = newRating;
    await course.save();

    res.status(200).json({
      message: "Course rating updated successfully.",
      updatedCourse: course,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating course rating.", error: err.message });
  }
};

const recommendationcoures= async (req, res) => {
  const { areaOfInterest, skills } = req.body;

  if (!areaOfInterest || !skills || skills.length === 0) {
    return res.status(400).json({ message: "Invalid student data" });
  }

  try {
    // Fetch courses that match the area of interest or skills
    const courses = await Course.find({
      $or: [
        { skills: { $in: skills } },
        { skills: areaOfInterest },
      ],
    }).sort({ rating: -1 }); // Sort by rating (highest first)

    res.json({ recommendations: courses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching recommendations", error: err.message });
  }
};
module.exports = { addCourse,getCoursesByTeacherId ,getAllCourses,getCourseById,updateCourseRating,recommendationcoures};
