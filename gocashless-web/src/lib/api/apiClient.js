
import axios from 'axios';

// You might need to run: npm install axios
const apiClient = axios.create({
  baseURL: 'http://localhost:7000', // Directly connecting to user-management-service for testing
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add an interceptor to automatically add the JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
