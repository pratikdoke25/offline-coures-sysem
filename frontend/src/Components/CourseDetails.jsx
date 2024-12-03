import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/course/course/${courseId}`);
        const data = await response.json();
        if (data.success) {
          setCourse(data.data);
        } else {
          console.error('Failed to fetch course:', data.message);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Zoom-In Effect Card */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:translate-y-[-10px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{course.courseName}</h1>
        
        <div className="mb-6">
          <p className="text-lg text-gray-600">{course.description}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Instructor:</strong> {course.instructorName}
          </p>
          <p className="text-gray-700">
            <strong>Price:</strong> ₹{course.price}
          </p>
          <div className="flex items-center text-yellow-500">
            <span className="text-xl">&#9733;</span>
            <span className="ml-2">{course.rating.toFixed(1)} / 5</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <strong className="text-gray-700">Skills: </strong>
          <ul className="list-disc pl-6">
            {course.skills.map((skill, index) => (
              <li key={index} className="text-gray-600">{skill}</li>
            ))}
          </ul>
        </div>

        {/* Enroll Now Button */}
        <div className="flex justify-center">
          {course.isEnrolled ? (
            <button className="bg-gray-400 text-white px-6 py-2 rounded-md font-semibold">Already Enrolled</button>
          ) : (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
