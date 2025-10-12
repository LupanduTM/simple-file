
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const paymentApiClient = axios.create({
  baseURL: `${API_BASE_URL}:8765/payment-processing-service`,
  withCredentials: true,
});

export default paymentApiClient;
