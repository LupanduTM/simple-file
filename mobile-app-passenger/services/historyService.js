
// In a real app, you'd centralize this
const API_BASE_URL = "http://192.168.137.74"; 

// Function to get transactions for a specific passenger (user)
export const getPassengerTransactions = async (userId) => {
  try {
    // Assuming the transaction-history-service is on port 8084
    const response = await fetch(`${API_BASE_URL}:8084/api/v1/transactions/user/${userId}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch transactions: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching passenger transactions:', error);
    throw error;
  }
};
