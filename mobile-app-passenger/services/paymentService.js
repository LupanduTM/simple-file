
const API_BASE_URL = 'http://10.159.183.13:8083/api/v1'; // Replace with your actual local IP

export const initiatePayment = async (paymentRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error; // Re-throw the error to be handled by the calling component
  }
};
