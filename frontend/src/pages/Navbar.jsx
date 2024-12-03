import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  // Dummy profile data (replace it with data from sessionStorage or API)
  const teacherDataFromSession = JSON.parse(sessionStorage.getItem('teacherData')) || {};
  const teacherId = teacherDataFromSession.id || '';
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation(); // Hook to get current URL
  const handleViewProfile = () => {
    navigate('/teacher-details'); // Navigate to the teacher details page
  };
  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

  const handleLogout = () => {
    sessionStorage.removeItem('teacherData');
    window.location.href = "/teacher-login"; // Redirect to login page after logout
  };


  // Fetch teacher data based on teacherId
  const fetchTeacherData = async () => {
    if (teacherId) {
      try {
        const response = await fetch(`http://localhost:3000/api/teacher/all/${teacherId}`);
        const data = await response.json();
        setTeacherData(data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  // Check if the current path includes 'instructor-dashboard'
  const isInstructorDashboard = location.pathname.includes('instructor-dashboard');

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center space-x-2">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl">Navbar</span>
        </Link>

        <div className="flex-grow" />

        {/* Google-Style Search Bar */}
        <div className="relative flex items-center w-full max-w-md mx-auto bg-white rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 px-4 text-gray-800 bg-transparent rounded-full focus:outline-none"
          />
          <button className="absolute right-3 text-gray-500">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
            </svg>
          </button>
        </div>

        {/* Profile Dropdown */}
        {teacherId && teacherData ? (
          <div className="relative ml-4">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-1 bg-gray-100 border-0 py-1 px-2 focus:outline-none hover:bg-gray-200 rounded text-base transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-semibold">{teacherData.name}</span>
              <img
                src={teacherData.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg">
                <div className="px-4 py-3 text-gray-700 border-b">
                  <div className="flex items-center space-x-3">
                    <img
                      src={teacherData.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{teacherData.name}</p>
                      <p className="text-sm text-gray-500">{teacherData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col px-4 py-3 space-y-2 text-gray-700">
                  {/* User Profile */}
                  <button
                    onClick={handleViewProfile}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <i className="fas fa-user text-indigo-500 mr-3"></i>
                    <span>View Profile</span>
                  </button>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <i className="fas fa-sign-out-alt text-red-500 mr-3"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !isInstructorDashboard && (
          <>
            {/* Login Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={toggleProfileDropdown}
                className="bg-gray-100 border-0 py-1 px-2 focus:outline-none hover:bg-gray-200 rounded text-base transition-all duration-300 transform hover:scale-105"
              >
                Login
                <span className="ml-1">&#9660;</span>
              </button>
            </div>

            {/* Register Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={toggleProfileDropdown}
                className="bg-gray-100 border-0 py-1 px-2 focus:outline-none hover:bg-gray-200 rounded text-base transition-all duration-300 transform hover:scale-105"
              >
                Signup
                <span className="ml-1">&#9660;</span>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    User Register
                  </Link>
                  <Link
                    to="/teacher-register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Teacher Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
