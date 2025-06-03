import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnimation } from 'framer-motion';

/**
 * Custom hook for smooth page transitions
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Animation duration in seconds
 * @param {Array|Function} options.ease - Animation easing function
 * @param {number} options.delay - Animation delay in seconds
 * @returns {Object} Animation controls
 */
const usePageTransition = (options = {}) => {
  const location = useLocation();
  const controls = useAnimation();
  
  const {
    duration = 0.8,
    ease = [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feel
    delay = 0,
  } = options;

  useEffect(() => {
    // Reset scroll position on page change
    window.scrollTo(0, 0);
    
    // Start entrance animation
    const startAnimation = async () => {
      // First, set to initial state
      await controls.set({
        opacity: 0,
        y: 30,
        filter: 'blur(10px)',
      });
      
      // Then animate to visible state
      await controls.start({
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration,
          ease,
          delay,
        },
      });
    };
    
    startAnimation();
  }, [location.pathname, controls, duration, ease, delay]);

  return controls;
};

export default usePageTransition;