import axios from "axios";

const BASE_URL = process.env.REACT_APP_ROOT_URL || "http://localhost:5000";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Get token from localStorage
      const token = window.localStorage.getItem('auth_token');
      if (token) {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
    } catch (error) {
      console.warn('Error parsing auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized), clear auth data and redirect to login
    if (error.response?.status === 401) {
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('auth_user');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

const invoke = ({ url, method = 'GET', headers, data, ...rest }) => 
  axiosInstance({ url, method, headers, data, ...rest });

export default invoke;