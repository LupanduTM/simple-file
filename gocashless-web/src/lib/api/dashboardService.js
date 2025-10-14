import thsApiClient from './thsApiClient';

export const dashboardService = {
  getKpis: () => {
    return thsApiClient.get('/api/v1/transactions/stats/kpis').then(res => res.data);
  },

  getTransactionsOverTime: () => {
    return thsApiClient.get('/api/v1/transactions/stats/over-time').then(res => res.data);
  },

  getTransactionsByStatus: () => {
    return thsApiClient.get('/api/v1/transactions/stats/by-status').then(res => res.data);
  },

  getTransactionsByType: () => {
    return thsApiClient.get('/api/v1/transactions/stats/by-type').then(res => res.data);
  },

  getTopRoutes: () => {
    return thsApiClient.get('/api/v1/transactions/stats/top-routes').then(res => res.data);
  },

  getTopConductors: () => {
    return thsApiClient.get('/api/v1/transactions/stats/top-conductors').then(res => res.data);
  },
};
