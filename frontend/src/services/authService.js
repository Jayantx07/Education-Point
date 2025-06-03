import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios with longer timeout for Render free tier
const axiosConfig = {
  timeout: 30000, // 30 seconds timeout for Render free tier spin-up
};

const authApi = axios.create({
  baseURL: `${API_URL}/users`,
  ...axiosConfig
});

// Register a new user
export const register = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to register user');
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await authApi.post('/login', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to login');
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('userInfo');
  // Optionally, you can also make an API call to invalidate the token on the server
};

// Get current user's profile
export const getMyProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.get('/profile', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch profile');
  }
};

// Update current user's profile
export const updateUserProfile = async (userData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.put('/profile', userData, config);
    if (response.data && response.data.token) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

// Admin: Get all users
export const getAllUsers = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.get('/', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch users');
  }
};

// Admin: Get user by ID
export const getUserById = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.get(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch user details');
  }
};

// Admin: Update user
export const updateUser = async (id, userData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.put(`/${id}`, userData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update user');
  }
};

// Admin: Delete user
// Admin: Delete user by ID
export const deleteUser = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.delete(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete user');
  }
};

// Delete current user's profile
export const deleteUserProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await authApi.delete('/profile', config);
    return response.data;
  } catch (error) {
    console.error('Error deleting user profile:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete user profile');
  }
};

export default {
  register,
  login,
  logout,
  getMyProfile, // Corrected from getProfile
  updateUserProfile, // Corrected from updateProfile
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteUserProfile,
};