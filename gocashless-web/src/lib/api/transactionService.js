import thsApiClient from './thsApiClient';

export const transactionService = {
  getTransactions: () => {
    return thsApiClient.get('/api/v1/transactions/').then(res => res.data);
  },

  getTransactionsByConductorId: (conductorId) => {
    return thsApiClient.get(`/api/v1/transactions/conductor/${conductorId}`).then(res => res.data);
  },
};
