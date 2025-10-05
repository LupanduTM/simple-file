
import routeApiClient from './routeApiClient';

export const busStopService = {
  getAllBusStops: () => {
    return routeApiClient.get('/api/v1/bus-stops').then(res => res.data);
  },

  getBusStopsByRoute: (routeId) => {
    return routeApiClient.get(`/api/v1/bus-stops/by-route/${routeId}`).then(res => res.data);
  },

  createBusStop: (busStopData) => {
    return routeApiClient.post('/api/v1/bus-stops', busStopData).then(res => res.data);
  },

  updateBusStop: (id, busStopData) => {
    return routeApiClient.put(`/api/v1/bus-stops/${id}`, busStopData).then(res => res.data);
  },

  deleteBusStop: (id) => {
    return routeApiClient.delete(`/api/v1/bus-stops/${id}`).then(res => res.data);
  },
};
