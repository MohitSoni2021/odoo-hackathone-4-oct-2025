import axios from 'axios';
import { encryptData, decryptData } from '../utils/encryption';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Get token from user object in sessionStorage
    const encryptedUserStr = sessionStorage.getItem('user');
    if (encryptedUserStr) {
      try {
        const user = decryptData(encryptedUserStr);
        if (user) {
          console.log('API Request:', {
            url: config.url,
            method: config.method,
            userRole: user?.role,
            hasToken: !!user?.token,
          });
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
      } catch (error) {
        console.error('Error decrypting user from sessionStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;