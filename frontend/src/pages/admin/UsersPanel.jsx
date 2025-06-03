import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiEdit, FiTrash2, FiSearch, FiFilter, FiUserCheck, FiUserX } from 'react-icons/fi';
import * as authService from '../../services/authService';

// User Form Modal Component
const UserFormModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // When editing, don't include password fields
      setFormData({
        name: user.name || '',
        email: user.email || '',
        isAdmin: user.isAdmin || false,
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
      });
    }
    setError('');
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation for new users
    if (!user) { // Only for new users
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else if (formData.password) { // If changing password for existing user
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...dataToSubmit } = formData;
      
      // If editing and password is empty, remove it from submission
      if (user && !dataToSubmit.password) {
        const { password, ...dataWithoutPassword } = dataToSubmit;
        onSubmit(dataWithoutPassword);
      } else {
        onSubmit(dataToSubmit);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className="text-2xl font-semibold mb-4">{user ? 'Edit User' : 'Add New User'}</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {user ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={formData.password} 
              onChange={handleChange} 
              required={!user} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" 
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {user ? 'Confirm New Password' : 'Confirm Password'}
            </label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required={!user || formData.password.length > 0} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" 
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="isAdmin" 
              id="isAdmin" 
              checked={formData.isAdmin} 
              onChange={handleChange} 
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">Admin Privileges</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(''); // 'Admin', 'User', '' for all

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authService.deleteUser(userId);
        setUsers(prev => prev.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleToggleAdminStatus = async (userId, currentStatus) => {
    try {
      const updatedUser = await authService.updateUser(userId, { isAdmin: !currentStatus });
      setUsers(prev => prev.map(user => user._id === userId ? updatedUser : user));
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        const updatedUser = await authService.updateUser(editingUser._id, formData);
        setUsers(prev => prev.map(user => user._id === editingUser._id ? updatedUser : user));
      } else {
        const newUser = await authService.register(formData);
        setUsers(prev => [...prev, newUser]);
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user. Please try again.');
    }
  };

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => 
      filterRole === 'Admin' ? user.isAdmin : 
      filterRole === 'User' ? !user.isAdmin : 
      true
    );

  if (loading) return <div className="p-6 text-center"><p className="text-lg text-gray-500">Loading users...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-lg text-red-500">{error}</p></div>;

  return (
    <motion.div 
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Users</h2>
        <button 
          onClick={handleAddUser} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center space-x-2 transition duration-150"
        >
          <FiPlusCircle size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="searchUser" className="block text-sm font-medium text-gray-700">Search Users</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="searchUser" 
                id="searchUser" 
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700">Filter by Role</label>
            <select 
              id="roleFilter" 
              name="roleFilter" 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admins</option>
              <option value="User">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <motion.tr 
                key={user._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button onClick={() => handleToggleAdminStatus(user._id, user.isAdmin)} className={user.isAdmin ? "text-orange-600 hover:text-orange-900" : "text-purple-600 hover:text-purple-900"} title={user.isAdmin ? "Remove Admin Rights" : "Make Admin"}>
                    {user.isAdmin ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                  </button>
                  <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900" title="Edit User"><FiEdit size={18} /></button>
                  <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900" title="Delete User"><FiTrash2 size={18} /></button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }} 
        onSubmit={handleFormSubmit} 
        user={editingUser} 
      />
    </motion.div>
  );
};

export default UsersPanel;