
import axios from 'axios';

const userApiClient = axios.create({
  baseURL: 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json',
  },
});

userApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userApiClient;
