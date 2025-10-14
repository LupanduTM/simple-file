import axios from 'axios';

const thsApiClient = axios.create({
  baseURL: 'http://localhost:7004', // Connect to the Transaction History Service
  headers: {
    'Content-Type': 'application/json',
  },
});

export default thsApiClient;
