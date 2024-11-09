import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

// Sample courses data with city and skills fields
const coursesData = [
  { id: 1, name: 'React for Beginners', description: 'Learn React from scratch.', rating: 4.5, city: 'New York', skills: ['React', 'JavaScript'] },
  { id: 2, name: 'Advanced JavaScript', description: 'Master JavaScript with advanced concepts.', rating: 4.8, city: 'San Francisco', skills: ['JavaScript', 'ES6'] },
  { id: 3, name: 'Python for Data Science', description: 'Learn Python programming and its application in Data Science.', rating: 4.3, city: 'Chicago', skills: ['Python', 'Data Science'] },
  { id: 4, name: 'Web Development Bootcamp', description: 'Learn full-stack web development.', rating: 4.7, city: 'New York', skills: ['HTML', 'CSS', 'JavaScript'] },
];

const StudentDashboard = () => {
  const [courses, setCourses] = useState(coursesData);
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
  });
  const [ratingFilter, setRatingFilter] = useState(0); // Rating filter
  const [cityFilter, setCityFilter] = useState('');     // City filter
  const [skillFilter, setSkillFilter] = useState('');   // Skill filter

  // Filter courses based on rating, city, and skills
  useEffect(() => {
    let filtered = courses;

    if (ratingFilter > 0) {
      filtered = filtered.filter(course => course.rating >= ratingFilter);
    }

    if (cityFilter) {
      filtered = filtered.filter(course => course.city === cityFilter);
    }

    if (skillFilter) {
      filtered = filtered.filter(course => course.skills.includes(skillFilter));
    }

    setFilteredCourses(filtered);
  }, [ratingFilter, cityFilter, skillFilter, courses]);

  const handleEditProfile = () => {
    alert('Edit Profile functionality goes here!');
  };

  const handleRatingFilterChange = (e) => {
    setRatingFilter(Number(e.target.value));
  };

  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
  };

  const handleSkillFilterChange = (e) => {
    setSkillFilter(e.target.value);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Welcome, {profile.name}!</h1>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Rating Filter */}
          <div>
            <label className="block text-lg mb-2">Filter by Rating:</label>
            <select 
              className="p-2 rounded border w-full"
              value={ratingFilter}
              onChange={handleRatingFilterChange}
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-lg mb-2">Filter by City:</label>
            <select 
              className="p-2 rounded border w-full"
              value={cityFilter}
              onChange={handleCityFilterChange}
            >
              <option value="">All Cities</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-lg mb-2">Filter by Skill:</label>
            <select 
              className="p-2 rounded border w-full"
              value={skillFilter}
              onChange={handleSkillFilterChange}
            >
              <option value="">All Skills</option>
              <option value="React">React</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Data Science">Data Science</option>
              <option value="Python">Python</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
            </select>
          </div>
        </div>

        {/* Courses Section */}
        <div id="courses" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-1"><strong>City:</strong> {course.city}</p>
              <p className="text-sm text-gray-500 mb-2"><strong>Skills:</strong> {course.skills.join(', ')}</p>
              <div className="flex items-center">
                <Star className="text-yellow-400" />
                <span className="ml-1 text-sm">{course.rating} / 5</span>
              </div>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
