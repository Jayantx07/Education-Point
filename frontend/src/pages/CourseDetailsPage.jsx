import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiAward, FiUser, FiDollarSign, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { getCourseById } from '../services/courseService';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

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
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
          <FiArrowLeft className="mr-2" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Course Image */}
              <motion.div variants={itemVariants} className="relative">
                <img 
                  src={course.image || 'https://via.placeholder.com/800x450?text=Course+Image'} 
                  alt={course.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                      {course.category}
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">{course.title}</h1>
                  </div>
                </div>
              </motion.div>

              {/* Course Tabs */}
              <div className="border-b">
                <nav className="flex">
                  {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Course Description</h2>
                    <p className="text-gray-700 mb-6">{course.description}</p>

                    <h3 className="text-lg font-bold text-gray-900 mb-3">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {course.features?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      )) || (
                        <li className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-gray-700">Comprehensive course content</span>
                        </li>
                      )}
                    </ul>

                    <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-6">
                      <li>Basic understanding of the subject</li>
                      <li>Computer with internet connection</li>
                      <li>Dedication to learn and practice</li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'curriculum' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                    
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((module) => (
                        <div key={module} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer">
                            <h3 className="font-medium text-gray-900">Module {module}: {['Introduction', 'Core Concepts', 'Advanced Techniques', 'Final Project'][module-1]}</h3>
                            <span className="text-sm text-gray-500">4 lessons • 45 min</span>
                          </div>
                          <div className="divide-y">
                            {[1, 2, 3, 4].map((lesson) => (
                              <div key={`${module}-${lesson}`} className="px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <FiBook className="text-gray-400 mr-3" />
                                  <span className="text-gray-700">Lesson {lesson}: Sample Lesson Title</span>
                                </div>
                                <span className="text-sm text-gray-500">10:30</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'instructor' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h2>
                    
                    <div className="flex items-start mb-6">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img 
                          src="https://via.placeholder.com/150?text=Instructor" 
                          alt={course.instructor || 'Instructor'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{course.instructor || 'Expert Instructor'}</h3>
                        <p className="text-gray-500 text-sm">Senior Educator & Industry Expert</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">
                      Our instructor is a seasoned professional with over 10 years of experience in the field. 
                      They have worked with leading companies and have a passion for teaching and sharing their knowledge.
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FiBook className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">12 Courses</span>
                      </div>
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">2,500+ Students</span>
                      </div>
                      <div className="flex items-center">
                        <FiAward className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">4.8 Rating</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">4.8 (120 reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { name: 'Rahul Sharma', rating: 5, date: '2 months ago', comment: 'This course exceeded my expectations. The instructor explains complex concepts in a simple way, and the practical exercises helped me apply what I learned immediately.' },
                        { name: 'Priya Patel', rating: 4, date: '3 months ago', comment: 'Great course with lots of practical examples. I would have liked more advanced content, but overall it was very helpful for my career.' },
                        { name: 'Amit Kumar', rating: 5, date: '4 months ago', comment: 'The best course I\'ve taken on this subject. The instructor is knowledgeable and responsive to questions. Highly recommended!' },
                      ].map((review, index) => (
                        <div key={index} className="border-b pb-6 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-medium text-gray-700">{review.name.charAt(0)}</span>
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium text-gray-900">{review.name}</h4>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <button className="text-primary hover:text-primary-dark font-medium">Load More Reviews</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24"
            >
              <motion.div variants={itemVariants} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold text-gray-900">₹{course.price}</div>
                  {course.originalPrice && (
                    <div className="flex items-center">
                      <span className="text-lg text-gray-500 line-through mr-2">₹{course.originalPrice}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Save {Math.round((1 - course.price / course.originalPrice) * 100)}%</span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center mb-4">
                  <FiShoppingCart className="mr-2" />
                  Enroll Now
                </button>

                <p className="text-center text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiClock className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-500">8 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiBook className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Lessons</p>
                      <p className="text-sm text-gray-500">64 lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Students</p>
                      <p className="text-sm text-gray-500">1,240+ enrolled</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiAward className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Certificate</p>
                      <p className="text-sm text-gray-500">Yes, upon completion</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="border-t px-6 py-4">
                <button className="w-full text-center text-primary hover:text-primary-dark font-medium">Gift this course</button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img 
                    src={`https://via.placeholder.com/300x200?text=Course+${item}`} 
                    alt={`Related Course ${item}`} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white text-primary text-sm font-medium px-2 py-1 rounded-full">
                    ₹4,999
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-500 mb-1">Web Development</div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">Related Course Title That Might Be Long</h3>
                  <div className="flex items-center text-sm mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-gray-500">(42)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <FiClock className="mr-1" />
                      <span>6 weeks</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FiBook className="mr-1" />
                      <span>24 lessons</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetailsPage;