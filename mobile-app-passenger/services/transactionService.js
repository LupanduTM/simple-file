import transactionHistoryApiClient from './transactionHistoryApiClient';

export const getTransactionHistory = async (userId) => {
  try {
    const response = await transactionHistoryApiClient.get(`/api/v1/transactions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};
