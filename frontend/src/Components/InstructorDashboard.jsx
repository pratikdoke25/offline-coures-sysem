import React, { useState } from 'react';

const InstructorDashboard = () => {
  // States for managing the active tab, course data, and new course form data
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courses, setCourses] = useState([
    { id: 1, name: 'Computer Science 101', description: 'Introduction to CS' },
    { id: 2, name: 'Physics 101', description: 'Basic Physics Course' },
    { id: 3, name: 'Mathematics 101', description: 'Fundamentals of Mathematics' },
    { id: 4, name: 'Chemistry 101', description: 'Introduction to Chemistry' },
    { id: 5, name: 'Biology 101', description: 'Basic Biology Course' },
    { id: 6, name: 'English 101', description: 'Introduction to English Literature' },
  ]);
  const [newCourse, setNewCourse] = useState({ name: '', description: '' });

  // Toggle modal visibility
  const toggleAddCourseModal = () => setShowAddCourseModal(!showAddCourseModal);

  // Handle adding a new course
  const handleAddCourse = (e) => {
    e.preventDefault();
    const newCourseData = {
      id: courses.length + 1,
      name: newCourse.name,
      description: newCourse.description,
    };
    setCourses([...courses, newCourseData]);
    setNewCourse({ name: '', description: '' });
    toggleAddCourseModal();
  };

  // Switch between tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-6xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Instructor Dashboard</h1>
          <button
            onClick={toggleAddCourseModal}
            className="relative bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            <i className="fas fa-plus-circle mr-2 animate-pulse"></i>
            <span>Add New Course</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('courses')}
          >
            My Courses
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('statistics')}
          >
            Course Statistics
          </button>
        </div>

        {/* Display the active tab content */}
        {activeTab === 'courses' && (
          <div>
            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                    <button className="text-blue-500 hover:text-blue-700 transition duration-200">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-end">
                    <button className="text-red-500 hover:text-red-700 transition duration-200">
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Enrolled Courses</h3>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Active Courses</h3>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Completed Courses</h3>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Students</h3>
                <p className="text-2xl font-bold">12,739</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Courses</h3>
                <p className="text-2xl font-bold">11</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Earnings</h3>
                <p className="text-2xl font-bold">$1,231</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition duration-200">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform scale-95 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse}>
              <div className="mb-4">
                <label htmlFor="courseName" className="block text-sm text-gray-600">
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="courseDescription" className="block text-sm text-gray-600">
                  Course Description
                </label>
                <textarea
                  id="courseDescription"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  <i className="fas fa-check-circle mr-2"></i> Add Course
                </button>
                <button
                  type="button"
                  onClick={toggleAddCourseModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  <i className="fas fa-times-circle mr-2"></i> Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
