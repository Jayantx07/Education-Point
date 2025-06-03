import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios with longer timeout for Render free tier
const axiosConfig = {
  timeout: 30000, // 30 seconds timeout for Render free tier spin-up
};

const contactApi = axios.create({
  baseURL: `${API_URL}/contact`,
  ...axiosConfig
});

// Submit a contact form message
export const submitContactForm = async (formData) => {
  try {
    const response = await contactApi.post('/', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to submit contact form');
  }
};

// Admin: Get all contact messages
export const getAllContactMessages = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await contactApi.get('/', config);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch contact messages');
  }
};

// Admin: Get a single contact message by ID
export const getContactMessageById = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await contactApi.get(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact message ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch contact message details');
  }
};

// Admin: Update contact message status
export const updateContactMessageStatus = async (id, statusData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await contactApi.put(`/${id}`, statusData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact message status ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update contact message status');
  }
};

// Admin: Delete a contact message
export const deleteContactMessage = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await contactApi.delete(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting contact message ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete contact message');
  }
};

export default {
  submitContactForm,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
};