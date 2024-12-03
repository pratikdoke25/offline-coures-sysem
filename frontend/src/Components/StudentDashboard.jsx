import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cityFilter, setCityFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const navigate = useNavigate();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/course/courses');
        const data = await response.json();
        if (data.success) {
          setCourses(data.data);
          setFilteredCourses(data.data);
        } else {
          console.error('Failed to fetch courses:', data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on selected filters
  useEffect(() => {
    let filtered = courses;

    if (ratingFilter > 0) {
      filtered = filtered.filter((course) => course.rating >= ratingFilter);
    }
    if (cityFilter) {
      filtered = filtered.filter((course) => course.city === cityFilter);
    }
    if (skillFilter) {
      filtered = filtered.filter((course) => course.skills.includes(skillFilter));
    }

    setFilteredCourses(filtered);
  }, [ratingFilter, cityFilter, skillFilter, courses]);

  const handleShowDetails = (courseId) => {
    navigate(`/course/${courseId}`); // Redirect to course details page with course ID
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Explore Courses</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-lg font-semibold mb-2">Filter by Rating</label>
            <select
              className="w-full p-2 border rounded-md"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div> 
          <div>
            <label className="block text-lg font-semibold mb-2">Filter by Skill</label>
            <select
              className="w-full p-2 border rounded-md"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Web Development">Web Development</option>
              <option value="Python">Python</option>
            </select>
          </div>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="
                group 
                perspective-1000 
                relative 
                transform 
                transition-all 
                duration-500 
                hover:scale-105 
                hover:z-10
              "
            >
              {/* Card Background Layer */}
              <div 
                className="
                  absolute 
                  inset-0 
                  bg-gradient-to-br 
                  from-blue-100 
                  to-blue-200 
                  rounded-xl 
                  opacity-0 
                  group-hover:opacity-50 
                  transition-opacity 
                  duration-500 
                  -z-10 
                  transform 
                  group-hover:rotate-6
                "
              />

              {/* Main Card */}
              <div
                className="
                  bg-white 
                  shadow-lg 
                  rounded-xl 
                  p-6 
                  relative 
                  overflow-hidden 
                  border-2 
                  border-transparent 
                  transition-all 
                  duration-500 
                  group-hover:border-blue-400
                  group-hover:shadow-2xl
                "
              >
                {/* Hover Overlay */}
                <div 
                  className="
                    absolute 
                    inset-0 
                    bg-blue-500 
                    opacity-0 
                    group-hover:opacity-10 
                    transition-opacity 
                    duration-500 
                    -z-10
                  "
                />

                {/* Card Content */}
                <div className="relative z-10">
                  <h2 
                    className="
                      text-2xl 
                      font-semibold 
                      mb-2 
                      transition-colors 
                      duration-300 
                      group-hover:text-blue-600
                    "
                  >
                    {course.courseName}
                  </h2>
                  <p 
                    className="
                      text-gray-600 
                      mb-4 
                      transition-all 
                      duration-300 
                      group-hover:text-gray-800
                    "
                  >
                    {course.description}
                  </p>
                  <p 
                    className="
                      text-gray-700 
                      mb-2 
                      transition-transform 
                      duration-300 
                      group-hover:translate-x-2
                    "
                  >
                    <strong>Instructor:</strong> {course.instructorName}
                  </p>
                  <p 
                    className="
                      text-gray-700 
                      mb-2 
                      transition-transform 
                      duration-300 
                      group-hover:translate-x-2
                    "
                  >
                    <strong>Price:</strong> ₹{course.price}
                  </p>
                  <div 
                    className="
                      flex 
                      items-center 
                      mb-2 
                      transition-transform 
                      duration-300 
                      group-hover:scale-105
                    "
                  >
                    <span className="text-yellow-400">&#9733;</span>
                    <span className="ml-2">{course.rating.toFixed(1)} / 5</span>
                  </div>        
                  <div className="flex items-center flex-wrap">
                    {course.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="
                          bg-gray-200 
                          text-gray-800 
                          text-sm 
                          px-2 
                          py-1 
                          rounded-full 
                          mr-2 
                          mb-2 
                          transition-all 
                          duration-300 
                          group-hover:bg-blue-100 
                          group-hover:text-blue-800
                        "
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="
                        w-1/2 
                        bg-blue-500 
                        text-white 
                        py-2 
                        rounded 
                        hover:bg-blue-600 
                        transition-colors 
                        transform 
                        hover:scale-105 
                        active:scale-95
                      "
                      onClick={() => handleShowDetails(course._id)}
                    >
                      Show Details
                    </button>
                    {!course.isEnrolled && (
                      <button 
                        className="
                          w-1/2 
                          bg-green-500 
                          text-white 
                          py-2 
                          rounded 
                          hover:bg-green-600 
                          transition-colors 
                          transform 
                          hover:scale-105 
                          active:scale-95
                        "
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;