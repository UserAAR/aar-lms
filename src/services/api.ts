import axios from 'axios';
import coursesData from '../data/courses.json';
import projectsData from '../data/projects.json';
import eventsData from '../data/events.json';
import tasksData from '../data/tasks.json';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Unauthorized - clear localStorage and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock API endpoints with static data
api.get = async (url: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (url) {
    case '/api/classroom/courses':
      return { data: coursesData.courses };
    case '/api/projects':
      return { data: projectsData.projects };
    case '/api/events':
      return { data: eventsData.events };
    case '/api/todos':
      return { data: tasksData.tasks };
    default:
      throw new Error(`Endpoint not found: ${url}`);
  }
};

export default api;
