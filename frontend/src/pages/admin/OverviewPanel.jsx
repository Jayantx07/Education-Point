import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiMessageSquare, FiStar } from 'react-icons/fi';
import * as authService from '../../services/authService';
import * as courseService from '../../services/courseService';
import * as testimonialService from '../../services/testimonialService';
import * as contactService from '../../services/contactService';

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    className={`bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-l-', 'bg-')}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const OverviewPanel = () => {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    testimonials: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersData, coursesData, testimonialsData, messagesData] = await Promise.all([
          authService.getAllUsers(), // Assuming this returns an array of users
          courseService.getAllCourses(), // Assuming this returns an array of courses
          testimonialService.getAllTestimonials(), // Assuming this returns an array of testimonials
          contactService.getAllContactMessages(), // Assuming this returns an array of messages
        ]);

        setStats({
          users: usersData.length,
          courses: coursesData.length,
          testimonials: testimonialsData.length,
          messages: messagesData.length,
        });
      } catch (err) {
        console.error('Failed to fetch overview stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-lg text-gray-500">Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full"><p className="text-lg text-red-500">{error}</p></div>;
  }

  return (
    <motion.div 
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiUsers size={24} className="text-blue-500" />} title="Total Users" value={stats.users} color="border-l-blue-500" />
        <StatCard icon={<FiBookOpen size={24} className="text-green-500" />} title="Total Courses" value={stats.courses} color="border-l-green-500" />
        <StatCard icon={<FiStar size={24} className="text-yellow-500" />} title="Total Testimonials" value={stats.testimonials} color="border-l-yellow-500" />
        <StatCard icon={<FiMessageSquare size={24} className="text-purple-500" />} title="Total Messages" value={stats.messages} color="border-l-purple-500" />
      </div>

      {/* Placeholder for recent activity or charts */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <p className="text-gray-600">Recent activity feed or charts will be displayed here.</p>
        {/* Example: Could list recent user registrations, course additions, etc. */}
      </div>
    </motion.div>
  );
};

export default OverviewPanel;