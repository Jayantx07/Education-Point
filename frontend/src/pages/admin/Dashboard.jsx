import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiBook, FiMessageSquare, FiStar, FiUsers, FiLogOut } from 'react-icons/fi';
import { logout } from '../../services/authService';

// Import Panel Components
import OverviewPanel from './OverviewPanel';
import CoursesPanel from './CoursesPanel';
import TestimonialsPanel from './TestimonialsPanel';
import MessagesPanel from './MessagesPanel';
import UsersPanel from './UsersPanel';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }
    setUserInfo(user);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiHome /> },
    { id: 'courses', name: 'Courses', icon: <FiBook /> },
    { id: 'testimonials', name: 'Testimonials', icon: <FiStar /> },
    { id: 'messages', name: 'Messages', icon: <FiMessageSquare /> },
    { id: 'users', name: 'Users', icon: <FiUsers /> },
  ];

  // Animation variants
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
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {userInfo && (
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen p-4">
            <div className="flex items-center justify-center md:justify-start mb-8 pt-4">
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 mt-8"
              >
                <span><FiLogOut /></span>
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {tabs.find((tab) => tab.id === activeTab)?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Welcome back, {userInfo.name}!
              </p>
            </div>

            {/* Dashboard Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <OverviewPanel />}
              {activeTab === 'courses' && <CoursesPanel />}
              {activeTab === 'testimonials' && <TestimonialsPanel />}
              {activeTab === 'messages' && <MessagesPanel />}
              {activeTab === 'users' && <UsersPanel />}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Dashboard;