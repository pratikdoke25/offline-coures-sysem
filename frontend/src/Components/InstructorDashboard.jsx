import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  BookOpen, 
  Star, 
  Users, 
  DollarSign, 
  Edit, 
  Trash2,
  X 
} from 'lucide-react';

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
  // State for courses and modal
  const [courses, setCourses] = useState([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    description: '',
    skills: [],
    price: '',
    contactNumber: '', // New field for contact number
    instructorName: '' // New field for instructor's name
  });

  // Effect to fetch teacher data from sessionStorage
  useEffect(() => {
    // Retrieve teacher data from sessionStorage
    const teacherData = JSON.parse(sessionStorage.getItem('teacherData')) || {}; // Fetch from sessionStorage
    const teacherId = teacherData.id || ''; // Default to empty string if not found
    const teacherEmail = teacherData.email || ''; // Default to empty string if not found

    // Check if teacher data exists, if not, prevent course addition
    if (!teacherId || !teacherEmail) {
      console.error('Teacher ID or email not found in session storage.');
      return; // Optionally show a message to the user
    }

    setUserData({
      id: teacherId,
      name: teacherData.name,
      email: teacherEmail
    });
  }, []);

  const handleSkillChange = (skill) => {
    setNewCourse(prev => {
      const currentSkills = prev.skills;
      if (currentSkills.includes(skill)) {
        // Remove skill if already selected
        return {
          ...prev,
          skills: currentSkills.filter(s => s !== skill)
        };
      } else {
        // Add skill if not selected
        return {
          ...prev,
          skills: [...currentSkills, skill]
        };
      }
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!userData) {
      console.error('User data not found.');
      return; // Optionally show an error message
    }

    // Prepare course data
    const courseData = {
      ...newCourse,
      instructorId: userData.id,
      instructorName: newCourse.instructorName, // Instructor's name from the form
      contact: newCourse.contactNumber, // Contact number from the form
      skills: newCourse.skills,
      isEnrolled: true,
      price: parseFloat(newCourse.price)
    };

    try {
      const response = await fetch('http://localhost:3000/api/course/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        const addedCourse = await response.json();
        setCourses([...courses, addedCourse]);
        setIsAddCourseModalOpen(false);
        // Reset form
        setNewCourse({
          courseName: '',
          description: '',
          skills: [],
          price: '',
          contactNumber: '', // Reset contact number field
          instructorName: '' // Reset instructor's name field
        });
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Instructor Dashboard
          </h1>
          {userData && (
            <button 
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setIsAddCourseModalOpen(true)}
            >
              <PlusCircle size={20} /> Add Course
            </button>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{course.courseName}</h2>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:bg-blue-100 p-1 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-500 hover:bg-red-100 p-1 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-500" />
                  <span>{course.description}</span>
                </div>
                <div className="flex items-center gap-2">
  <Users size={16} className="text-green-500" />
  <span>{course.skills && Array.isArray(course.skills) ? course.skills.join(', ') : 'No skills listed'}</span>
</div>

                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-purple-500" />
                  <span>${course.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>{course.rating}/5 Rating</span>
                </div>
              </div>
            </div>
          ))}
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
                    onChange={(e) => setNewCourse({
                      ...newCourse, 
                      courseName: e.target.value
                    })}
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({
                      ...newCourse, 
                      description: e.target.value
                    })}
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
                        className={`px-3 py-1 rounded-full text-sm ${
                          newCourse.skills.includes(skill) 
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
                    onChange={(e) => setNewCourse({
                      ...newCourse, 
                      instructorName: e.target.value
                    })}
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-2">Contact Number</label>
                  <input 
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.contactNumber}
                    onChange={(e) => setNewCourse({
                      ...newCourse, 
                      contactNumber: e.target.value
                    })}
                    required 
                    pattern="\d{10}" // Ensure valid phone number
                  />
                </div>
                <div>
                  <label className="block mb-2">Price</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({
                      ...newCourse, 
                      price: e.target.value
                    })}
                    required 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Course
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
