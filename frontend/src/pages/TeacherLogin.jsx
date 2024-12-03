import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import Axios

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');
    try {
      // Send login request to the backend with proper headers
      const response = await axios.post(
        'http://localhost:3000/api/teacher/login',
        formData, // Form data (email, password)
        {
          headers: {
            'Content-Type': 'application/json', // Ensure the content type is correct
          },
        }
      );

      // Check if login was successful
      if (response.data.message === 'Login successful') {
        // Store user data in sessionStorage
        sessionStorage.setItem('teacherEmail', response.data.user.email);
        sessionStorage.setItem('teacherid', response.data.user.id);
        sessionStorage.setItem('teacherData', JSON.stringify(response.data.user));

        // Show success toast
        toast.success('Login successful!', { position: 'top-center' });

        // Add a delay before redirecting to the dashboard
        setTimeout(() => {
          navigate('/instructor-dashboard'); // Redirect to /instructor-dashboard after toast
        }, 2000); // Wait 2 seconds before redirecting (adjust as needed)

        // Log user data stored in sessionStorage to console
        console.log('User email stored in sessionStorage:', sessionStorage.getItem('teacherEmail'));
        console.log('User id stored in sessionStorage:', sessionStorage.getItem('teacherid'));
        console.log('User data stored in sessionStorage:', JSON.parse(sessionStorage.getItem('teacherData')));
      } else {
        setLoginError('Failed to log in. Please try again.');
        toast.error('Login failed. Try again.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Login error:', error.response || error); // Log error for debugging
      setLoginError(error.response?.data?.message || 'An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', { position: 'top-center' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Instructor Login</h2>
        {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
