
import API_BASE_URL from './apiConfig';

// Function to get transactions for a specific conductor
export const getConductorTransactions = async (conductorId) => {
  try {
    // We'll need to figure out the correct IP and port for the API gateway
    // For now, let's assume it's running on the same IP as the other services
    // and the transaction-history-service is on port 8084
    const response = await fetch(`${API_BASE_URL}:8084/api/v1/transactions/conductor/${conductorId}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch transactions: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conductor transactions:', error);
    throw error;
  }
};
