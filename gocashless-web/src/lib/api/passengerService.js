
import userApiClient from './userApiClient';

export const passengerService = {
  getPassengers: () => {
    return userApiClient.get('/api/v1/users/passengers').then(res => res.data);
  },

  resetPassword: (id) => {
    return userApiClient.post(`/api/v1/users/${id}/reset-password`).then(res => res.data);
  },

  deletePassenger: (id) => {
    return userApiClient.delete(`/api/v1/users/${id}`).then(res => res.data);
  },
};
