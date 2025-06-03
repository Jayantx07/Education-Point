import { motion } from 'framer-motion';

const PageTransition = ({ children, className = '' }) => {
  // Smooth, buttery transitions with subtle blur effect
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
      filter: 'blur(8px)',
    },
    in: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
    out: {
      opacity: 0,
      y: -10,
      filter: 'blur(8px)',
    },
  };

  // Optimized for smooth, butter-like transitions
  const pageTransition = {
    type: 'tween',
    ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feel
    duration: 0.6,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;