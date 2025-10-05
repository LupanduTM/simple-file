
import routeApiClient from './routeApiClient';

export const fareService = {
  getAllFares: () => {
    return routeApiClient.get('/api/v1/fares').then(res => res.data);
  },

  getFaresByRoute: (routeId) => {
    return routeApiClient.get(`/api/v1/fares/by-route/${routeId}`).then(res => res.data);
  },

  createFare: (fareData) => {
    return routeApiClient.post('/api/v1/fares', fareData).then(res => res.data);
  },

  updateFare: (id, fareData) => {
    return routeApiClient.put(`/api/v1/fares/${id}`, fareData).then(res => res.data);
  },

  deleteFare: (id) => {
    return routeApiClient.delete(`/api/v1/fares/${id}`).then(res => res.data);
  },

  lookupFare: (routeId, originStopId, destinationStopId) => {
    return routeApiClient.get(`/api/v1/fares/lookup?routeId=${routeId}&originStopId=${originStopId}&destinationStopId=${destinationStopId}`).then(res => res.data);
  },
};
