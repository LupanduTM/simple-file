
import axios from 'axios';

const routeApiClient = axios.create({
  baseURL: 'http://localhost:7001',
  headers: {
    'Content-Type': 'application/json',
  },
});

routeApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default routeApiClient;
