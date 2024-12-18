import React, { useState } from 'react';
import {
  FiMail as Mail,
  FiUser as User,
  FiLock as Lock,
  FiEye as Eye,
  FiEyeOff as EyeOff,
  FiPhone as Phone,
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import Axios

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    areaOfInterest: '',
    skills: [],
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const skillOptions = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Data Analysis'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setIsPasswordFocused(true);
      evaluatePasswordStrength(value);
    }
  };

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, skills: selectedSkills });
  };

  const evaluatePasswordStrength = (password) => {
    let strength = '';
    if (password.length < 6) {
      strength = 'Weak';
    } else if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      strength = 'Strong';
    } else if ((/[a-z]/.test(password) && /\d/.test(password)) || (/[A-Z]/.test(password) && /\d/.test(password))) {
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  const validateStep = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.areaOfInterest) newErrors.areaOfInterest = 'Please select an area of interest';
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep()) {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:3000/api/users/register', formData);
        toast.success(response.data.message, { position: 'top-center' });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed', { position: 'top-center' });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please correct the highlighted errors.', { position: 'top-center' });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Student Register</h2>

        {/* Email Field */}
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-2 pl-10 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Full Name Field */}
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              name="fullName"
              placeholder="Full Name"
              className={`w-full p-2 pl-10 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className={`w-full p-2 pl-10 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={`w-full p-2 pl-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.password}
              onChange={handleChange}
            />
            <div
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
          {isPasswordFocused && formData.password && (
            <p
              className={`text-sm ${
                passwordStrength === 'Strong'
                  ? 'text-green-500'
                  : passwordStrength === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              Password strength: {passwordStrength}
            </p>
          )}
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full p-2 pl-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        {/* Area of Interest Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Area of Interest</label>
          <select
            name="areaOfInterest"
            className={`w-full p-2 border ${errors.areaOfInterest ? 'border-red-500' : 'border-gray-300'} rounded`}
            value={formData.areaOfInterest}
            onChange={handleChange}
          >
            <option value="">Select an area</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Data Science">Data Science</option>
          </select>
          {errors.areaOfInterest && <p className="text-sm text-red-500">{errors.areaOfInterest}</p>}
        </div>

        {/* Skills Multi-Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Skills</label>
          <select
            name="skills"
            multiple
            className={`w-full p-2 border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded`}
            value={formData.skills}
            onChange={handleSkillChange}
          >
            {skillOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserRegistration;
