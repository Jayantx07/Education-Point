import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiStar, FiUser, FiCalendar } from 'react-icons/fi';
import { getAllTestimonials } from '../services/testimonialService';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getAllTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Filter testimonials by category
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'all') return true;
    return testimonial.category === filter;
  });

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
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Testimonials</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear what our students have to say about their learning experience at Education Point.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {['all', 'Web Development', 'Data Science', 'Design', 'Marketing'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${filter === category ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
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
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Testimonials Found</h2>
            <p className="text-gray-700 mb-6">
              We couldn't find any testimonials in this category. Please try another category.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              View All Testimonials
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} variants={itemVariants} />
            ))}
          </motion.div>
        )}

        {/* Featured Testimonial */}
        {!loading && !error && testimonials.length > 0 && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-12 md:p-12 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                      <img 
                        src="https://via.placeholder.com/150?text=Featured" 
                        alt="Featured Student" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3 md:pl-8">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl italic mb-6">
                      "Education Point transformed my career. The instructors are industry experts who provide practical knowledge that I use every day in my job. The community support is amazing too!"
                    </blockquote>
                    <div>
                      <p className="font-bold text-lg">Rahul Sharma</p>
                      <p className="text-white/80">Senior Web Developer at TechCorp</p>
                      <p className="text-white/60 text-sm mt-1">Web Development Graduate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Your Testimonial */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Are you a student at Education Point? We'd love to hear about your learning journey and experience with our courses.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Submit Your Testimonial
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${star <= (testimonial.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-900">{testimonial.name}</p>
          <p className="text-gray-500 text-sm">{testimonial.role || 'Student'}</p>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <FiCalendar className="mr-1" />
            <span>{new Date(testimonial.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsPage;