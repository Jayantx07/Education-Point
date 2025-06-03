import { useEffect, useState, useRef } from 'react';

/**
 * A hook for creating smooth, butter-like animations based on scroll position
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Value between 0 and 1 indicating how much of the element should be visible
 * @param {boolean} options.triggerOnce - Whether the animation should only trigger once
 * @param {number} options.rootMargin - Margin around the root
 * @returns {Array} [ref, isVisible, progress] - ref to attach to element, visibility state, and animation progress (0-1)
 */
const useSmoothAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
        
        // Calculate progress (0 to 1)
        setProgress(Math.min(Math.max(entry.intersectionRatio, 0), 1));
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Create thresholds from 0 to 1 in 0.01 steps
        rootMargin,
      }
    );

    // Track scroll position for parallax effects
    const handleScroll = () => {
      if (ref.current) {
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how far the element is through the viewport (0 to 1)
        const scrollProgress = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
        setProgress(Math.min(Math.max(scrollProgress, 0), 1));
      }
    };

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible, progress];
};

export default useSmoothAnimation;