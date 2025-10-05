
import userApiClient from './userApiClient';

export const conductorService = {
  getConductors: () => {
    return userApiClient.get('/api/v1/users/conductors').then(res => res.data);
  },

  createConductor: (conductorData) => {
    return userApiClient.post('/api/v1/users/register/conductor', conductorData).then(res => res.data);
  },

  updateConductor: (id, conductorData) => {
    return userApiClient.put(`/api/v1/users/update/${id}`, conductorData).then(res => res.data);
  },

  resetPassword: (id) => {
    return userApiClient.post(`/api/v1/users/${id}/reset-password`).then(res => res.data);
  },
};
