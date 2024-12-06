import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PlusCircle,
  BookOpen,
  Star,
  Users,
  X
} from 'lucide-react';
import { Edit, Trash2, Phone, DollarSign, Tag } from 'lucide-react';
const SKILLS_OPTIONS = [
  'JavaScript',
  'Web Development',
  'Frontend Development',
  'React',
  'Node.js',
  'Python',
  'Data Science',
  'Machine Learning'
];

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    description: '',
    skills: [],
    price: '',
    contactNumber: '',
    instructorName: ''
  });

  useEffect(() => {
    const teacherData = JSON.parse(sessionStorage.getItem('teacherData')) || {};
    const teacherId = teacherData.id || '';
    setUserData(teacherData);  // Ensure userData is set

    if (!teacherId) {
      setError('Teacher ID not found.');
      setIsLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/course/courses/teacher/${teacherId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data); // Use data.data for courses
          setError(null); // Clear any error
        } else {
          setError(data.message || 'Failed to fetch courses.');
        }
      })
      .catch((error) => {
        setError('Error fetching courses.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSkillChange = (skill) => {
    setNewCourse(prev => {
      const currentSkills = prev.skills;
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...currentSkills, skill] };
      }
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const storedUserData = JSON.parse(sessionStorage.getItem('teacherData'));
    if (!storedUserData || !storedUserData.id || !storedUserData.email) {
      console.error('User data not found.');
      return;
    }

    const courseData = {
      ...newCourse,
      userId: storedUserData.id,
      userEmail: storedUserData.email,
    };

    try {
      const response = await fetch('http://localhost:3000/api/course/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        toast.success('Coures Added Succefully..!', { position: 'top-center' });
        const addedCourse = await response.json();
        setCourses([...courses, addedCourse.data]);
        setIsAddCourseModalOpen(false);
        setNewCourse({
          courseName: '',
          description: '',
          skills: [],
          price: '',
          contactNumber: '',
          instructorName: '',
        });
      } else {
        console.error('Failed to add course');
        toast.error('Fail to add Coures..!', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Fail to add Coures..!', { position: 'top-center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
          {userData && (
            <button
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setIsAddCourseModalOpen(true)}
            >
              <PlusCircle size={20} /> Add Course
            </button>
          )}
        </div>

        <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out transform"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{course.courseName}</h2>
                  <div className="flex gap-2">
                    <button className="text-blue-500 border border-blue-500 hover:bg-blue-100 hover:text-blue-700 p-2 rounded-md transition-all duration-300">
                      <Edit size={20} className="mr-1" /> Edit
                    </button>
                    <button className="text-red-500 border border-red-500 hover:bg-red-100 hover:text-red-700 p-2 rounded-md transition-all duration-300">
                      <Trash2 size={20} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Description:</strong> {course.description || 'No description provided'}
                  </p>
                  <p className="text-gray-500">
                    <Phone size={18} className="mr-2 inline" /> Contact: {course.contact || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-semibold">Instructor:</span> {course.instructorName || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    <DollarSign size={18} className="mr-2 inline" /> Price: ${course.price || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    <Tag size={18} className="mr-2 inline" /> Skills: {course.skills.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No courses found for this instructor.</p>
          )}
        </div>
      </div>
    </div>

        {/* Add Course Modal */}
        {isAddCourseModalOpen && userData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setIsAddCourseModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block mb-2">Course Name</label>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.courseName}
                    onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className={`px-3 py-1 rounded-full text-sm ${newCourse.skills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                          }`}
                        onClick={() => handleSkillChange(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Instructor Name</label>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.instructorName}
                    onChange={(e) => setNewCourse({ ...newCourse, instructorName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Price</label>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Contact Number</label>
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    type="text"
                    value={newCourse.contactNumber}
                    onChange={(e) => setNewCourse({ ...newCourse, contactNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default InstructorDashboard;
