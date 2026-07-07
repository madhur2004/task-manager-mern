import axios from 'axios';

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clear authentication data
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Network Error (Server Down / No Internet)
    if (!error.response) {
      console.error('Network Error: Unable to connect to the server.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        clearAuth();

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;

      case 403:
        console.warn('Access denied.');
        break;

      case 404:
        console.warn('Requested resource not found.');
        break;

      case 500:
        console.error('Internal server error.');
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default api;