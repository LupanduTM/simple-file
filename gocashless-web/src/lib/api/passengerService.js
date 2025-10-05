
import userApiClient from './userApiClient';

export const passengerService = {
  getPassengers: () => {
    return userApiClient.get('/api/v1/users/passengers').then(res => res.data);
  },
};
