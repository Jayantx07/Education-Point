import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiLoader } from 'react-icons/fi';
import { getAllTestimonials } from '../../services/testimonialService';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTestimonials = await getAllTestimonials();
        setTestimonialsData(fetchedTestimonials);
      } catch (err) {
        setError(err.message || 'Failed to fetch testimonials. Please try again later.');
        setTestimonialsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    if (testimonialsData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    if (testimonialsData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (autoplay && testimonialsData.length > 0) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentIndex, testimonialsData.length]); // Added testimonialsData.length dependency

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-lg text-gray-600">
            Hear from our students about their experience and success stories with The Education Point.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loading && (
            <div className="min-h-[300px] flex justify-center items-center">
              <FiLoader className="animate-spin text-primary text-4xl" />
              <p className="ml-3 text-lg text-gray-600">Loading testimonials...</p>
            </div>
          )}
          {error && (
            <div className="min-h-[200px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl flex items-center justify-center" role="alert">
              <div>
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            </div>
          )}
          {!loading && !error && testimonialsData.length === 0 && (
            <div className="min-h-[300px] flex flex-col justify-center items-center text-center p-8 bg-white rounded-2xl">
              <FiStar size={48} className="text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">No testimonials available yet.</p>
              <p className="text-gray-400">Be the first to share your success story!</p>
            </div>
          )}
          {!loading && !error && testimonialsData.length > 0 && (
            <>
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonialsData.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id} 
                  className="min-w-full p-8 md:p-12 bg-white"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: index === currentIndex ? 1 : 0.7,
                    scale: index === currentIndex ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <motion.div 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.div 
                        className="flex mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            <FiStar 
                              className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} text-xl mr-1`} 
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.blockquote 
                        className="text-lg md:text-xl text-gray-700 italic mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        "{testimonial.quote}"
                      </motion.blockquote>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-primary">{testimonial.role}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - only show if there are testimonials */}
          {testimonialsData.length > 1 && (
            <>
              <motion.button 
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-primary hover:text-white transition-all duration-200 focus:outline-none z-10"
                aria-label="Previous testimonial"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronLeft className="text-xl" />
              </motion.button>
              
              <motion.button 
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-primary hover:text-white transition-all duration-200 focus:outline-none z-10"
                aria-label="Next testimonial"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronRight className="text-xl" />
              </motion.button>
            </>
          )}

          {/* Indicators - only show if there are testimonials */}
          {testimonialsData.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {testimonialsData.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to testimonial ${index + 1}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          )}
            </>
          )}
        </div>

        {/* Success Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-gray-700">Students Enrolled</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
            <p className="text-gray-700">Success Rate</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">10+</h3>
            <p className="text-gray-700">Years Experience</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-4xl font-bold text-primary mb-2">20+</h3>
            <p className="text-gray-700">Expert Teachers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;