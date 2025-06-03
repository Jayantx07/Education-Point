import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

const SectionTransition = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right'
  duration = 0.8,
  distance = 40,
  once = true,
  threshold = 0.15,
  blur = true
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once, threshold, margin: "-10% 0px -10% 0px" });
  
  // Get the appropriate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };
  
  // Variants for smooth, butter-like transitions
  const variants = {
    hidden: {
      opacity: 0,
      ...(blur ? { filter: "blur(8px)" } : {}),
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feel
      }
    }
  };

  // Trigger animation when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionTransition;