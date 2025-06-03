import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiBookOpen, FiMonitor, FiClock, FiUsers, FiShield, FiWifi } from 'react-icons/fi';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <FiBookOpen className="text-2xl" />,
      title: 'T.E.P. Library',
      description: 'Access our well-stocked library with study materials for all courses. Open from 6:00 AM to 11:00 PM.',
      color: 'bg-blue-500',
    },
    {
      icon: <FiMonitor className="text-2xl" />,
      title: 'Computer Classes',
      description: 'Learn essential computer skills with our specialized courses including RS-CIT certification.',
      color: 'bg-purple-500',
    },
    {
      icon: <FiClock className="text-2xl" />,
      title: 'Flexible Timings',
      description: 'Choose from multiple batches to fit your schedule with morning and evening options available.',
      color: 'bg-green-500',
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: 'Expert Teachers',
      description: 'Learn from experienced faculty including RAM SIR (Science & Biology) and SURYADEV SIR (Maths).',
      color: 'bg-yellow-500',
    },
    {
      icon: <FiShield className="text-2xl" />,
      title: 'CCTV Surveillance',
      description: 'Our campus is equipped with CCTV cameras for the safety and security of all students.',
      color: 'bg-red-500',
    },
    {
      icon: <FiWifi className="text-2xl" />,
      title: 'Full AC Facility',
      description: 'Study in comfort with fully air-conditioned classrooms and library facilities.',
      color: 'bg-indigo-500',
    },
  ];

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
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 md:py-24" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Our Facilities & Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            We provide state-of-the-art facilities to ensure the best learning experience for our students.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl shadow-card p-6 hover-lift hover-glow cursor-pointer group"
            >
              <motion.div 
                className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 10, scale: 1.2 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gray-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Facilities</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['RO Water', 'Hindi/English Medium', 'Separate Washrooms', 'Seating Arrangements'].map((facility, index) => (
              <motion.div 
                key={facility}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white rounded-lg px-6 py-3 shadow-sm hover-lift hover-glow cursor-pointer"
              >
                <span className="font-medium">{facility}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;