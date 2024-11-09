import React from 'react';
import { FaUser, FaStar, FaDollarSign } from 'react-icons/fa'; // Importing icons

// Mock data for courses
const courses = [
  {
    id: 1,
    title: 'Introduction to Python',
    instructor: 'John Doe',
    rating: 4.8,
    price: 29.99,
    image: 'https://example.com/python-course.jpg',
  },
  {
    id: 2,
    title: 'Web Development with React',
    instructor: 'Jane Smith',
    rating: 4.7,
    price: 39.99,
    image: 'https://example.com/react-course.jpg',
  },
  {
    id: 3,
    title: 'Data Science and Machine Learning',
    instructor: 'Alice Johnson',
    rating: 4.9,
    price: 49.99,
    image: 'https://example.com/ds-course.jpg',
  },
  {
    id: 4,
    title: 'Introduction to JavaScript',
    instructor: 'Robert Brown',
    rating: 4.6,
    price: 19.99,
    image: 'https://example.com/js-course.jpg',
  },
  {
    id: 5,
    title: 'Advanced CSS and Sass',
    instructor: 'Mary Lee',
    rating: 4.8,
    price: 34.99,
    image: 'https://example.com/css-course.jpg',
  },
  {
    id: 6,
    title: 'Full Stack Web Development',
    instructor: 'Chris Green',
    rating: 4.7,
    price: 59.99,
    image: 'https://example.com/full-stack-course.jpg',
  },
];

const HomePage = () => {
  return (
    <div className="bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore Our Courses</h1>
        <p className="text-gray-600">Learn new skills, advance your career, and achieve your goals.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={course.image}
              alt={course.title}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <FaUser className="mr-2 text-gray-500" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center text-yellow-500 mb-2">
              <FaStar className="mr-2" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center text-gray-800 font-semibold mb-4">
              <FaDollarSign className="mr-2 text-green-600" />
              <span>${course.price}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
