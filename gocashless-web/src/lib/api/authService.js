
import apiClient from './apiClient';

export const authService = {
  login: (credentials) => {
    // This will eventually call your user-management-service
    console.log('Logging in with:', credentials);
    // return apiClient.post('/auth/login', credentials);
    return Promise.resolve({ token: 'fake-jwt-token' }); // Mock response
  },

  register: (userData) => {
    return apiClient.post('/api/v1/users/register/buscompany', userData);
  },
};
