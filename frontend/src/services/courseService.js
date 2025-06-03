import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const courseApi = axios.create({
  baseURL: `${API_URL}/courses`,
});

// Fetch all courses
export const getAllCourses = async (category = 'all', search = '') => {
  try {
    const params = {};
    if (category && category.toLowerCase() !== 'all') {
      params.category = category;
    }
    if (search) {
      params.search = search;
    }
    const response = await courseApi.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch courses');
  }
};

// Fetch popular courses
export const getPopularCourses = async () => {
  try {
    const response = await courseApi.get('/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular courses:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch popular courses');
  }
};

// Fetch a single course by ID
export const getCourseById = async (id) => {
  try {
    const response = await courseApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch course details');
  }
};

// Admin: Create a new course
export const createCourse = async (courseData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await courseApi.post('/', courseData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to create course');
  }
};

// Admin: Update a course
export const updateCourse = async (id, courseData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await courseApi.put(`/${id}`, courseData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update course');
  }
};

// Admin: Delete a course
export const deleteCourse = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await courseApi.delete(`/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete course');
  }
};

export default {
  getAllCourses,
  getPopularCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};