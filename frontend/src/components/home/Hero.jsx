import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowUpRight } from 'react-icons/fi';
import gsap from 'gsap';

const Hero = () => {
  const backgroundRef = useRef(null);
  
  useEffect(() => {
    // Animate background elements with GSAP
    const ctx = gsap.context(() => {
      gsap.to('.gradient-circle-1', {
        x: 50,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      
      gsap.to('.gradient-circle-2', {
        x: -30,
        y: 50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      
      gsap.to('.gradient-circle-3', {
        x: 20,
        y: 20,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, backgroundRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={backgroundRef}
      className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50 to-white opacity-70"></div>
        
        {/* Gradient Circles */}
        <div className="gradient-circle-1 absolute top-20 right-[20%] w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="gradient-circle-2 absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="gradient-circle-3 absolute top-[40%] left-[30%] w-72 h-72 rounded-full bg-accent/20 blur-3xl"></div>
        
        {/* Vector Lines */}
        <div className="absolute top-1/4 right-0 w-1/3 h-px bg-gradient-to-r from-transparent to-primary/30"></div>
        <div className="absolute bottom-1/3 left-0 w-1/3 h-px bg-gradient-to-l from-transparent to-secondary/30"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top Chip */}
        <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full py-2 px-4 mb-8">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mr-2">
            <FiSearch className="text-primary text-sm" />
          </div>
          <p className="text-sm font-medium text-gray-800">Your #1 Platform for learning best.</p>
        </div>

        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Showcase Your Mastery.</span>{' '}
              <span className="text-gray-900">Get Connected</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Create your profile, showcase your skills, and let employers find you. Join our coaching programs for CUET, NEET, Foundation, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/register" className="btn-primary">
                  Register Now
                  <FiArrowUpRight className="ml-2" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/courses" className="btn-outline">
                  Explore Courses
                </Link>
              </motion.div>
            </div>
          </div>
          
          <div className="relative">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto lg:mx-0 mb-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for courses, subjects..." 
                  className="w-full bg-white border border-gray-200 rounded-full py-4 px-6 pr-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                />
                <motion.button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiSearch />
                </motion.button>
              </div>
              
              <div className="absolute -bottom-4 left-6 right-6 h-8 bg-white/80 blur-xl rounded-full"></div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {[
                { icon: "10+", title: "Years Experience", desc: "In education field", color: "bg-primary/10", textColor: "text-primary" },
                { icon: "500+", title: "Students", desc: "Enrolled every year", color: "bg-secondary/10", textColor: "text-secondary" },
                { icon: "95%", title: "Success Rate", desc: "In competitive exams", color: "bg-accent/10", textColor: "text-accent" },
                { icon: "24/7", title: "Library Access", desc: "For registered students", color: "bg-gray-100", textColor: "text-gray-800" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-card p-4 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                    <span className={`${stat.textColor} font-bold`}>{stat.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{stat.title}</h3>
                  <p className="text-sm text-gray-600">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;