import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios with longer timeout for Render free tier
const axiosConfig = {
  timeout: 30000, // 30 seconds timeout for Render free tier spin-up
};

const testimonialApi = axios.create({
  baseURL: `${API_URL}/testimonials`,
  ...axiosConfig
});

// Fetch all testimonials
export const getAllTestimonials = async () => {
  try {
    const response = await testimonialApi.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch testimonials');
  }
};

// Fetch a single testimonial by ID
export const getTestimonialById = async (id) => {
  try {
    const response = await testimonialApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching testimonial ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch testimonial details');
  }
};

// Admin: Create a new testimonial
export const createTestimonial = async (testimonialData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await testimonialApi.post('/', testimonialData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to create testimonial');
  }
};

// Admin: Update a testimonial
export const updateTestimonial = async (id, testimonialData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await testimonialApi.put(`/${id}`, testimonialData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating testimonial ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update testimonial');
  }
};

// Admin: Delete a testimonial
export const deleteTestimonial = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await testimonialApi.delete(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting testimonial ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete testimonial');
  }
};

export default {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};