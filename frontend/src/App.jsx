import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import Footer from './pages/Footer';
import UserRegistration from './pages/Register';
import TeacherLoginPage from './pages/TeacherLogin';
import TeacherRegistration from './pages/TeacherRegister';
import AdminLoginPage from './Auth/AdminLoginPage';
import StudentDashboard from './Components/StudentDashboard';
import InstructorDashboard from './Components/InstructorDashboard';
import AdminDashboard from './Auth/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/teacher-login" element={<TeacherLoginPage />} />
          <Route path="/teacher-register" element={<TeacherRegistration />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
