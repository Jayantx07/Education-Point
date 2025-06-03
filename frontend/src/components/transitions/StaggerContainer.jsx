import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import React from 'react';

const StaggerContainer = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, threshold });

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

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      }
    }
  };

  // Child variants
  const childVariants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feel
      }
    }
  };

  // Clone children and add variants
  const staggeredChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return (
        <motion.div variants={childVariants}>
          {child}
        </motion.div>
      );
    }
    return child;
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {staggeredChildren}
    </motion.div>
  );
};

export default StaggerContainer;