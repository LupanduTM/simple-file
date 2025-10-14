
import apiClient from './apiClient';

export const authService = {
  login: (credentials) => {
    return apiClient.post('/api/v1/auth/login', credentials, {
      headers: {
        'X-Client-App': 'ADMIN_WEB_DASHBOARD',
      },
    });
  },

  register: (userData) => {
    return apiClient.post('/api/v1/users/register/buscompany', userData);
  },
};
