import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cityFilter, setCityFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const navigate = useNavigate();
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [userData, setUserData] = useState(null); // To store user data
  const [loading, setLoading] = useState(true);  // To show loading state
  const [error, setError] = useState(null);      // To handle errors
  const [isEnrolled, setIsEnrolled] = useState(false);  // To track enrollment success
  const [enrollMessage, setEnrollMessage] = useState(""); // To store success message
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Initialize as an empty array
  // Fetch courses from API
  // Hook initialization and useEffect at the top level
  const handleShowDetails = (courseId) => {
    navigate(`/course/${courseId}`); // Redirect to course details page with course ID
  };
  const handleEdit = () => {
    alert('Edit functionality not implemented');
    // Implement edit logic here (e.g., show a modal with edit form)
  };


  // Function to handle delete
  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete your profile?');
    if (confirmed) {
      // Call an API to delete user data
      alert('Profile deleted');
      // You can delete the user profile by making a DELETE request to the backend
    }
  };

  const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage
  const email = sessionStorage.getItem('email'); // Get email from sessionStorage
  // Handle enroll button click
  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch('http://localhost:3000/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userId: userId,
          courseId: courseId,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setEnrollMessage("Successfully Enrolled!");
        toast.success('Successfully Enrolled!', { position: 'top-center' });
        setIsEnrolled(true);
        setTimeout(() => {
          setEnrollMessage("");  // Hide the message after 3 seconds
        }, 3000);

        // Refresh the page after successful enrollment
        setTimeout(() => {
          window.location.reload();
        }, 3000);  // Wait for the success message to disappear before refreshing
      } else {
        setEnrollMessage(result.message);
        toast.message('You are already enrolled in this course.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      setEnrollMessage('Enrollment failed. Please try again.');
      toast.error('You are already enrolled in this course..!', { position: 'top-center' });
    }
  };

  const updateCourseRating = async (courseId, newRating) => {
    try {
      const response = await fetch("http://localhost:3000/api/course/update-rating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, newRating }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success('Rating updated Succesfully..!', { position: 'top-center' });
        console.log("Rating updated:", result.updatedCourse);
        // Optionally, update the course locally in the state
        const updatedCourses = enrolledCourses.map(course =>
          course._id === courseId ? { ...course, rating: newRating } : course
        );
        setEnrolledCourses(updatedCourses);
      } else {
        console.error(result.message);
        toast.error('Failed to upated..!', { position: 'top-center' });
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error('Failed to upated..!', { position: 'top-center' });
    }
  };


  // Function to filter and sort courses
const filterAndSortCourses = (courseList, student) => {
  const studentSkills = student.skills || [];
  const areaOfInterest = student.areaOfInterest || "";

  const sortedCourses = courseList.map((course) => {
    const matchingSkills = course.skills.filter((skill) =>
      studentSkills.includes(skill)
    );
    const matchScore = matchingSkills.length;
    const interestMatch = course.skills.includes(areaOfInterest) ? 1 : 0;

    return {
      ...course,
      matchScore: matchScore + interestMatch,
    };
  });

  // Sort by matchScore first, then by rating (ensure rating is a number)
  const sortedByMatch = sortedCourses.sort((a, b) => {
    // First sort by matchScore
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    // If matchScore is the same, sort by rating, ensuring it's a valid number
    const ratingA = Number(a.rating) || 0; // Default to 0 if rating is invalid
    const ratingB = Number(b.rating) || 0; // Default to 0 if rating is invalid

    return ratingB - ratingA; // Sort by rating descending
  });

  setFilteredCourses(sortedByMatch); // For the explore tab
  setRecommendedCourses(sortedByMatch.slice(0, 5)); // Top 5 for recommendations
};


  useEffect(() => {
    const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage

    if (userId) {
      // Fetch user data by ID
      fetch(`http://localhost:3000/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUserData(data);  // Set user data
          }
          setLoading(false);   // Stop loading
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data');
          setLoading(false);  // Stop loading in case of error
        });
    } else {
      setError('User ID not found in session storage');
      setLoading(false); // Stop loading if no userId
    }
  }, []);

  //Fetch all the courses

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

  //fetch userdata by id

  useEffect(() => {
    const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage

    if (userId) {
      // Fetch user data by ID
      fetch(`http://localhost:3000/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUserData(data); // Set user data
          }
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data');
          setLoading(false); // Stop loading in case of error
        });
    } else {
      setError('User ID not found in session storage');
      setLoading(false); // Stop loading if no userId
    }
  }, []);

  // Correct placement of fetchEnrolledCourses

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const userEmail = sessionStorage.getItem('email'); // Retrieve email from sessionStorage
        const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage

        // Fetch enrolled course data
        const enrolledResponse = await fetch('http://localhost:3000/api/enrolled-courses');
        const enrolledData = await enrolledResponse.json();

        if (!enrolledData.success) {
          console.error('Failed to fetch enrolled courses:', enrolledData.message);
          return;
        }

        // Filter enrolled courses for the logged-in user
        const userEnrolledCourses = enrolledData.data.filter(
          (enroll) => enroll.email === userEmail && enroll.userId === userId && enroll.isEnrolled
        );

        // Fetch all courses
        const coursesResponse = await fetch('http://localhost:3000/api/course/courses');
        const coursesData = await coursesResponse.json();

        if (!coursesData.success) {
          console.error('Failed to fetch all courses:', coursesData.message);
          return;
        }

        // Match enrolled courses with course details
        const matchedCourses = userEnrolledCourses.map((enroll) =>
          coursesData.data.find((course) => course._id === enroll.courseId)
        );

        // Set enrolled courses to state
        setEnrolledCourses(matchedCourses.filter(Boolean)); // Filter out null matches
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Ensure all hooks are at the top

 // Render course cards
 useEffect(() => {
  if (userData && courses.length > 0) {
    const filterAndSortCourses = (courseList, student) => {
      const studentSkills = student.skills || [];
      const areaOfInterest = student.areaOfInterest || "";

      const sortedCourses = courseList
        .map((course) => {
          const matchingSkills = course.skills.filter((skill) =>
            studentSkills.includes(skill)
          );
          const matchScore = matchingSkills.length;
          const interestMatch = course.skills.includes(areaOfInterest) ? 2 : 0;

          return {
            ...course,
            matchScore: matchScore + interestMatch,
          };
        })
        .sort((a, b) => {
          if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
          }
          return b.rating - a.rating; // Secondary sort by rating
        });

      return sortedCourses;
    };

    const filteredCourses = filterAndSortCourses(courses, userData);
    setRecommendedCourses(filteredCourses);
  }
}, [userData, courses]);

 // Fetch the course list from an API or initialize with sample data
  // Fetch courses on component mount
 // Fetch courses from the backend
  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/course/courses'); // Adjust the URL to your backend
        const result = await response.json();
        
        // Access the 'data' property if the API response contains it
        if (result.success && Array.isArray(result.data)) {
          setCourseList(result.data);
          setFilteredCourses(result.data); // Set initial filtered courses to all courses
        } else {
          console.error('Invalid data format:', result);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Handle filtering based on rating and skill
  useEffect(() => {
    if (Array.isArray(courseList)) { // Ensure courseList is an array before filtering
      const filtered = courseList.filter((course) => {
        return (
          (ratingFilter === 0 || course.rating >= ratingFilter) &&
          (skillFilter === '' || course.skills.includes(skillFilter))
        );
      });
      setFilteredCourses(filtered);
    }
  }, [ratingFilter, skillFilter, courseList]);

  return (
    <div className="min-h-screen bg-gray-100 relative font-sans">
      {/* Sidebar Slider */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isSliderOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors text-xl"
          onClick={() => setIsSliderOpen(false)}
        >
          ✖
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">Menu</h2>
          <button
            className={`w-full text-left py-2 px-4 rounded mb-4 text-gray-700 hover:bg-blue-100 transition ${activeTab === 'explore' ? 'bg-blue-200 font-bold' : ''
              }`}
            onClick={() => setActiveTab('explore')}
          >
            Home
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded mb-4 text-gray-700 hover:bg-blue-100 transition ${activeTab === 'profile' ? 'bg-blue-200 font-bold' : ''
              }`}
            onClick={() => setActiveTab('profile')}
          >
            View Profile
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded text-gray-700 hover:bg-blue-100 transition ${activeTab === 'enrolled' ? 'bg-blue-200 font-bold' : ''
              }`}
            onClick={() => setActiveTab('enrolled')}
          >
            Enrolled Courses
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded text-gray-700 hover:bg-blue-100 transition ${activeTab === 'recommended' ? 'bg-blue-200 font-bold' : ''
              }`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended Courses
          </button>
        </div>
      </div>

      {/* Header */}
      <button
        className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100 transition mx-4"
        onClick={() => setIsSliderOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-blue-600" />
      </button>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center mt-8">
          {userData && activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg transform transition-all hover:scale-105 hover:shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
              <p className="text-gray-700 mb-2">
                <strong>Name:</strong> {userData.fullName}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> {userData.email}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> {userData.phone}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Area of Interest:</strong> {userData.areaOfInterest}
              </p>
              <div className="mb-4">
                <strong>Skills:</strong>
                <ul className="list-disc pl-5 text-gray-700">
                  {userData.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
  {activeTab === 'enrolled' && (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Enrolled Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
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
                    <h3
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
                    </h3>
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
                    <p
                      className="
                        text-gray-700 
                        mb-2 
                        transition-transform 
                        duration-300 
                        group-hover:translate-x-2
                      "
                    >
                      <strong>Rating:</strong> {course.rating}
                    </p>

                    {/* Rating Update Section */}
                    <div className="mt-2">
                      <label htmlFor={`rating-${course._id}`} className="text-gray-700">
                        Update Rating:
                      </label>
                      <select
                        id={`rating-${course._id}`}
                        defaultValue={course.rating}
                        onChange={(e) => updateCourseRating(course._id, parseFloat(e.target.value))}
                        className="ml-2 border border-gray-300 p-1 rounded"
                      >
                        {[...Array(6).keys()].map((rating) => (
                          <option key={rating} value={rating}>{rating}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No enrolled courses found.</p>
          )}
        </div>
      </div>
    </div>
  )}
</div>


      </div>
      {activeTab === 'recommended' && (
  <div className="min-h-screen bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Recommended Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedCourses.length === 0 ? (
          <p className="text-gray-600 text-center">No courses found matching your interests.</p>
        ) : (
          recommendedCourses.map((course) => (
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
                  <h3
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
                  </h3>
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
                        className="w-1/2 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors transform hover:scale-105 active:scale-95"
                        onClick={() => handleEnroll(course._id)}
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}




      
      {/* Courses */}
      {activeTab === 'explore' && (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Explore Courses</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
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

            {/* Course Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
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
                      {/* Card Content */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-semibold mb-2">{course.courseName}</h2>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <p className="text-gray-700 mb-2">
                          <strong>Instructor:</strong> {course.instructorName}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Price:</strong> ₹{course.price}
                        </p>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-400">&#9733;</span>
                          <span className="ml-2">{course.rating.toFixed(1)} / 5</span>
                        </div>
                        <div className="flex items-center flex-wrap">
                          {course.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            className="w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            onClick={() => handleShowDetails(course._id)}
                          >
                            Show Details
                          </button>
                          {!course.isEnrolled && (
                            <button
                              className="w-1/2 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                              onClick={() => handleEnroll(course._id)}
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No courses available</div>
              )}
            </div>
          </div>
        </div>
      )}
  <ToastContainer/>
    </div>
    
  );
};

export default StudentDashboard;