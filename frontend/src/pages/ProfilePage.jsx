import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiEdit3, FiSave, FiTrash2, FiAlertTriangle, FiCheckCircle, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { getMyProfile, updateUserProfile, deleteUserProfile } from '../services/authService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user || !user.token) {
          navigate('/login');
          return;
        }
        const profileData = await getMyProfile(user.token);
        setUserInfo(profileData);
        setFormData({ name: profileData.name, email: profileData.email, currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setIsLoading(false);
        document.title = `${profileData.name}'s Profile - Education Point`;
      } catch (err) {
        setError(err.message || 'Failed to load profile. Please try again.');
        setIsLoading(false);
        if (err.message.includes('Not authorized')) {
            localStorage.removeItem('userInfo');
            navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsUpdating(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.');
      setIsUpdating(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const updateData = { name: formData.name, email: formData.email };
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      const updatedUser = await updateUserProfile(updateData, user.token);
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify({ ...user, name: updatedUser.name, email: updatedUser.email }));
      window.dispatchEvent(new Event('userInfoChanged')); // Notify Navbar
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please check your current password if changing password.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      await deleteUserProfile(user.token);
      localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('userInfoChanged')); // Notify Navbar
      navigate('/login');
      // Optionally, show a success message on the login page via state or query params
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FiLoader className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-12 md:py-20"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl md:text-5xl font-semibold">
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
              >
                {isEditing ? <FiUser size={20} className="text-gray-600" /> : <FiEdit3 size={20} className="text-primary" />}
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{userInfo?.name}</h1>
            <p className="text-gray-600">{userInfo?.email}</p>
            {userInfo?.isAdmin && <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Admin</span>}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <FiAlertTriangle className="mr-2" /> {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <FiCheckCircle className="mr-2" /> {successMessage}
            </motion.div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="form-input" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t border-gray-200">Change Password (Optional)</h3>
              <div className="relative">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" id="currentPassword" value={formData.currentPassword} onChange={handleChange} className="form-input pr-10" placeholder="Leave blank to keep current" />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type={showNewPassword ? 'text' : 'password'} name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} className="form-input pr-10" placeholder="Min. 6 characters" />
                 <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type={showConfirmNewPassword ? 'text' : 'password'} name="confirmNewPassword" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} className="form-input pr-10" />
                 <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isUpdating} className="btn-primary">
                  {isUpdating ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />} Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600">Manage your personal information and account settings.</p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-red-600 mb-3">Danger Zone</h3>
            <p className="text-gray-600 mb-4">Deleting your account is permanent and cannot be undone. All your data will be removed.</p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="btn-danger flex items-center justify-center w-full md:w-auto"
            >
              {isDeleting ? <FiLoader className="animate-spin mr-2" /> : <FiTrash2 className="mr-2" />} Delete My Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full"
          >
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="text-red-500 text-3xl mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Confirm Account Deletion</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you absolutely sure you want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="btn-danger">
                {isDeleting ? <FiLoader className="animate-spin mr-1" /> : <FiTrash2 className="mr-1" />} Yes, Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfilePage;