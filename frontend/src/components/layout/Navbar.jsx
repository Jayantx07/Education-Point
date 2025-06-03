import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { logout as logoutService } from '../../services/authService'; // Renamed to avoid conflict

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(user);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Listen for changes in localStorage for userInfo
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
    };
    window.addEventListener('storage', handleStorageChange); // For changes in other tabs
    // Custom event for changes in the same tab (e.g., after login/logout)
    window.addEventListener('userInfoChanged', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userInfoChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logoutService();
    setUserInfo(null);
    navigate('/login');
    // Dispatch a custom event to notify other components (like Navbar itself) about the change
    window.dispatchEvent(new Event('userInfoChanged'));
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Logo.png" alt="Education Point" className="h-10" />
          <span className="font-catamaran text-2xl font-bold text-gray-800">Education Point</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                to={link.path} 
                className={`font-medium transition-all duration-300 relative group ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-gray-800 hover:text-primary'}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {userInfo ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 font-medium transition-all duration-300 hover-glow ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-gray-800 hover:text-primary'}`}
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </motion.div>
                <motion.button 
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 font-medium transition-all duration-300 hover-glow ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-gray-800 hover:text-primary'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className={`font-medium transition-all duration-300 hover-glow ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-gray-800 hover:text-primary'}`}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/register" 
                    className="btn-primary hover-glow glow-pulse"
                  >
                    Register Now
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="font-medium text-gray-800 hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {userInfo ? (
              <>
                <Link 
                  to="/profile" 
                  className="font-medium text-gray-800 hover:text-primary py-2 flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="font-medium text-gray-800 hover:text-primary py-2 flex items-center space-x-2 w-full text-left"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="font-medium text-gray-800 hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary w-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;