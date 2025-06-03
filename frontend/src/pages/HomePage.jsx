import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import Courses from '../components/home/Courses';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'Education Point - Your #1 Platform for Learning';
  }, []);

  return (
    <div>
      {/* Hero section */}
      <Hero />
      
      {/* Other sections */}
      <Courses />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;