import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CTA = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(user);

    // Listen for changes in localStorage for userInfo
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
    };
    window.addEventListener('storage', handleStorageChange); // For changes in other tabs
    window.addEventListener('userInfoChanged', handleStorageChange); // For custom event from Navbar

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userInfoChanged', handleStorageChange);
    };
  }, []);
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN0dWRlbnRzJTIwc3R1ZHlpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" 
                alt="Students studying" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Join Our Community</h3>
                  <p className="text-white/90">Be part of our success story</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Enroll now in our courses and take the first step towards academic excellence and a successful career. 
                  Limited seats available for the upcoming batch.
                </p>

                <div className="space-y-6">
                  {[
                    { step: "1", title: "Register Online", desc: "Fill out the registration form to secure your spot" },
                    { step: "2", title: "Visit Campus", desc: "Complete the admission process at our campus" },
                    { step: "3", title: "Start Learning", desc: "Begin your journey to success with our expert guidance" }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.step}
                      className="flex items-start group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      whileHover={{ x: 10 }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="font-bold">{item.step}</span>
                      </motion.div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  {!userInfo && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/register" className="btn-primary hover-glow glow-pulse">
                        Register Now
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          <FiArrowRight />
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/contact" className="btn-outline hover-glow">
                      Contact Us
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;