
import axios from 'axios';

// You might need to run: npm install axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8765', // Connect to the API Gateway
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export default apiClient;
