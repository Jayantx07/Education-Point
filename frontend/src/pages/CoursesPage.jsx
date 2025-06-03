import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiBook, FiStar, FiX } from 'react-icons/fi';
import { getAllCourses } from '../services/courseService';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('popularity');

  // Categories
  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'AI & ML',
    'Digital Marketing',
    'Design',
    'Business',
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...courses];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((course) => course.category === activeCategory);
    }

    // Price range filter
    result = result.filter(
      (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popularity':
      default:
        // Assuming courses have a 'students' or 'enrollments' field
        result.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, activeCategory, priceRange, sortBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newPriceRange);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setPriceRange([0, 10000]);
    setSortBy('popularity');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="py-16"
    >
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gradient">Explore Our</span>{' '}
            <span className="text-gray-900">Courses</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover a wide range of courses designed to help you achieve your learning goals and advance your career.
          </motion.p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for courses..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
            >
              <FiFilter className="mr-2" />
              Filters
              {(activeCategory !== 'All' || priceRange[0] > 0 || priceRange[1] < 10000 || sortBy !== 'popularity') && (
                <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price-low">Sort by: Price (Low to High)</option>
              <option value="price-high">Sort by: Price (High to Low)</option>
              <option value="newest">Sort by: Newest</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-6 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark flex items-center"
                >
                  <FiX className="mr-1" /> Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-1 rounded-full text-sm ${activeCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">₹{priceRange[0]}</span>
                      <span className="text-sm text-gray-500">₹{priceRange[1]}</span>
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Category Pills (visible on mobile and desktop) */}
        <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredCourses.length}</span> results
            {activeCategory !== 'All' && (
              <span> in <span className="font-medium">{activeCategory}</span></span>
            )}
            {searchTerm && (
              <span> for <span className="font-medium">"{searchTerm}"</span></span>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h2>
            <p className="text-gray-700 mb-6">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search term.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} variants={itemVariants} />
            ))}
          </motion.div>
        )}

        {/* Pagination (if needed) */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-md ${page === 1 ? 'bg-primary text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Course Card Component
const CourseCard = ({ course, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link to={`/course/${course._id}`}>
        <div className="relative">
          <img
            src={course.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title)}`}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white text-primary text-sm font-medium px-2 py-1 rounded-full">
            ₹{course.price}
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs text-gray-500 mb-1">{course.category}</div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
          <div className="flex items-center text-sm mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-4 h-4 ${star <= (course.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-gray-500">({course.reviews || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <FiClock className="mr-1" />
              <span>{course.duration || '8 weeks'}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <FiBook className="mr-1" />
              <span>{course.lessons || '24'} lessons</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CoursesPage;