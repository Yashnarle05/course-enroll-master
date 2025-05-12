
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify({ 
      email: response.data.email,
    }));
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (name, email, password, role) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// Course services
export const getAllCourses = async (title = '', level = '') => {
  try {
    let url = '/courses';
    const params = new URLSearchParams();
    
    if (title) params.append('title', title);
    if (level) params.append('level', level);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Create course error:', error);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await apiClient.put(`/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Update course error:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete course error:', error);
    throw error;
  }
};

// Enrollment services
export const enrollCourse = async (courseId) => {
  try {
    const response = await apiClient.post('/enrollments/enroll', { courseId });
    return response.data;
  } catch (error) {
    console.error('Enrollment error:', error);
    throw error;
  }
};

export const getEnrolledCourses = async () => {
  try {
    const response = await apiClient.get('/enrollments');
    return response.data;
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    throw error;
  }
};

export const updateCourseProgress = async (courseId, progress) => {
  try {
    const response = await apiClient.put('/enrollments/progress', { courseId, progress });
    return response.data;
  } catch (error) {
    console.error('Update progress error:', error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  updateCourseProgress
};
