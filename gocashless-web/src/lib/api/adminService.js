
import userApiClient from './userApiClient';

export const adminService = {
  getAdmins: () => {
    return userApiClient.get('/api/v1/users/admins').then(res => res.data);
  },

  createAdmin: (adminData) => {
    return userApiClient.post('/api/v1/users/register/admin', adminData).then(res => res.data);
  },

  updateAdminStatus: (id, status) => {
    return userApiClient.put(`/api/v1/users/${id}/status`, { status }).then(res => res.data);
  },
};
