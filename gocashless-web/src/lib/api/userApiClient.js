
import axios from 'axios';

const userApiClient = axios.create({
  baseURL: 'http://localhost:8765',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export default userApiClient;
