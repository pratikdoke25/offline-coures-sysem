import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeacherDetails = () => {
  // Dummy profile data (replace it with data from sessionStorage or API)
  const teacherDataFromSession = JSON.parse(sessionStorage.getItem('teacherData')) || {};
  const teacherId = teacherDataFromSession.id || '';

  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTeacherData, setEditTeacherData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Fetch teacher data based on teacherId
  const fetchTeacherData = async () => {
    if (teacherId) {
      try {
        const response = await fetch(`http://localhost:3000/api/teacher/all/${teacherId}`);
        const data = await response.json();
        setTeacherData(data);
        setEditTeacherData({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password
        });
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Open and close the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit to update teacher data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/teacher/all/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTeacherData),
      });
      const updatedData = await response.json();
      setTeacherData(updatedData);
      closeModal(); // Close modal after saving changes
    } catch (error) {
      console.error('Error updating teacher data:', error);
    }
  };

  // Handle delete teacher data
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/teacher/all/${teacherId}`, { method: 'DELETE' });
      alert('Teacher deleted successfully');
      window.location.reload(); // Refresh the page after deletion
    } catch (error) {
      console.error('Error deleting teacher data:', error);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center items-center mb-4">
            <img
              src={teacherData.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"}
              alt="profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">{teacherData.fullName}</h2>
            <p className="text-gray-600">{teacherData.email}</p>
            <p className="text-gray-600">{teacherData.phone}</p>
          </div>

          <div className="flex justify-center space-x-4 mb-4">
            <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>

          {/* Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Edit Teacher Details</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editTeacherData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editTeacherData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editTeacherData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editTeacherData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDetails;
