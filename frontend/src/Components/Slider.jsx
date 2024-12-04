import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/course/courses");
        const data = await response.json();
        if (data.success) {
          setCourses(data.data);
          setFilteredCourses(data.data);
        } else {
          console.error("Failed to fetch courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleShowDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative font-sans">
      {/* Sidebar Slider */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isSliderOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors text-xl"
          onClick={() => setIsSliderOpen(false)}
        >
          ✖
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Menu</h2>
          <button
            className={`w-full text-left py-2 px-4 rounded mb-4 text-gray-700 hover:bg-blue-100 transition ${
              activeTab === "profile" ? "bg-blue-200 font-bold" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            View Profile
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded text-gray-700 hover:bg-blue-100 transition ${
              activeTab === "enrolled" ? "bg-blue-200 font-bold" : ""
            }`}
            onClick={() => setActiveTab("enrolled")}
          >
            Enrolled Courses
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
          onClick={() => setIsSliderOpen(true)}
        >
          Open Menu
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> John Doe
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> johndoe@example.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +1234567890
            </p>
          </div>
        )}

        {activeTab === "enrolled" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Enrolled Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter((course) => course.isEnrolled) // Assuming enrolled courses have `isEnrolled` flag
                .map((course) => (
                  <div
                    key={course._id}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {course.courseName}
                    </h3>
                    <p className="text-gray-600 text-sm">{course.description}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
