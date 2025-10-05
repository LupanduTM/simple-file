
import routeApiClient from './routeApiClient';

export const routeService = {
  getRoutes: () => {
    return routeApiClient.get('/api/v1/routes').then(res => res.data);
  },

  createRoute: (routeData) => {
    return routeApiClient.post('/api/v1/routes', routeData).then(res => res.data);
  },

  updateRoute: (id, routeData) => {
    return routeApiClient.put(`/api/v1/routes/${id}`, routeData).then(res => res.data);
  },

  deleteRoute: (id) => {
    return routeApiClient.delete(`/api/v1/routes/${id}`).then(res => res.data);
  },
};
