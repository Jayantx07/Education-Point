import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiUsers, FiClock, FiAward, FiLoader } from 'react-icons/fi'; // Using FiLoader for consistency
import { getAllCourses, getPopularCourses } from '../../services/courseService';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Added for future search functionality
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Courses' },
    { id: 'popular', label: 'Popular Courses' }, // Added popular tab
    { id: 'competitive', label: 'Competitive Exams' }, // Maps to CUET, NEET
    { id: 'foundation', label: 'Foundation' }, // Maps to FOUNDATION, Pre-FOUNDATION
    { id: 'computer', label: 'Computer Classes' }, // Maps to COMPUTER
    { id: 'language', label: 'Language' }, // Maps to ENGLISH (or other language courses)
    // Add more specific tabs if needed, e.g., Maths, Science, SST
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        let fetchedCourses;
        if (activeTab === 'popular') {
          fetchedCourses = await getPopularCourses();
        } else {
          // Map frontend tab 'id' to backend 'category' if necessary, or use directly
          // For 'competitive', backend might expect 'CUET' or 'NEET'. For now, pass tab id.
          // The getAllCourses service handles 'all' by not passing category.
          fetchedCourses = await getAllCourses(activeTab === 'all' ? undefined : activeTab, searchTerm);
        }
        setCoursesData(fetchedCourses);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses. Please try again later.');
        setCoursesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeTab, searchTerm]);

  // const filteredCourses = activeTab === 'all' 
  //   ? coursesData 
  //   : coursesData.filter(course => course.category.toLowerCase().includes(activeTab.toLowerCase()));
  // Filtering is now handled by API calls based on activeTab and searchTerm
  const filteredCourses = coursesData;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Featured Courses</h2>
          <p className="text-lg text-gray-600">
            Discover our wide range of courses designed to help you excel in your academic journey and career path.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 hover-glow ${activeTab === tab.id ? 'bg-primary text-white glow-pulse' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading && (
          <div className="col-span-full flex justify-center items-center py-10 min-h-[300px]">
            <FiLoader className="animate-spin text-primary text-4xl" />
            <p className="ml-3 text-lg text-gray-600">Loading courses...</p>
          </div>
        )}
        {error && (
          <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative min-h-[100px] flex items-center justify-center" role="alert">
            <div>
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        )}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-10 min-h-[300px] flex flex-col justify-center items-center">
            <FiBook size={48} className="text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">No courses found.</p>
            <p className="text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Course cards will be rendered here from filteredCourses */}
          </div>
        )}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-card hover-lift hover-glow group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <motion.img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">{course.title}</h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{course.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {course.features.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-primary mr-2">{feature.icon}</span>
                      <span className="text-sm text-gray-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={`/courses/${course.id}`} 
                    className="flex items-center justify-between w-full text-primary font-medium hover:text-primary/80 transition-colors duration-300"
                  >
                    <span>View Details</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiArrowRight />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/courses" className="btn-primary hover-glow glow-pulse">
              View All Courses
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                <FiArrowRight />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Courses;