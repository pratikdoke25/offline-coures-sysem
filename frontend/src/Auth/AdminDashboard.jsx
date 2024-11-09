import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useParams, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Blocked' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active' },
  ];

  const teachers = [
    { id: 1, name: 'Dr. Alice Brown', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Mr. Bob White', email: 'bob@example.com', status: 'Blocked' },
    { id: 3, name: 'Ms. Carol King', email: 'carol@example.com', status: 'Active' },
  ];

  const handleTabSwitch = (tab) => setActiveTab(tab);

  const handleBlockUser = (userType, userId) => {
    console.log(`Toggled block status for ${userType} with ID: ${userId}`);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleTabSwitch('students')}
        >
          Student Details
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${activeTab === 'teachers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleTabSwitch('teachers')}
        >
          Teacher Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'students' ? students : teachers).map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg relative">
            <Link to={`/user/${user.name.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold text-blue-600">
              {user.name}
            </Link>
            <p className="text-gray-600">{user.email}</p>
            <button
              className={`text-sm mt-2 px-2 py-1 rounded ${user.status === 'Blocked' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
              onClick={() => handleBlockUser(activeTab, user.id)}
            >
              {user.status === 'Blocked' ? 'Unblock' : 'Block'}
            </button>
            <button onClick={() => handleUserSelect(user)} className="mt-2 text-blue-500">
              View Details
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
            <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Status: {selectedUser.status}</p>
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      
      <Routes>
        <Route path="/user/:username" element={<UserDetails students={students} teachers={teachers} />} />
      </Routes>
    </div>
  );
};

const UserDetails = ({ students, teachers }) => {
  const { username } = useParams();
  const navigate = useNavigate();

  const user = [...students, ...teachers].find(
    (user) => user.name.replace(/\s+/g, '-').toLowerCase() === username
  );

  if (!user) return <p>User not found</p>;

  return (
    <div className="p-8">
      <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">
        Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold">{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Status: {user.status}</p>
      <p>Additional Info: Lorem ipsum dolor sit amet.</p>
    </div>
  );
};

export default AdminDashboard;
