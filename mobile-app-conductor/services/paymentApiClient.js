
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "./apiConfig";

const paymentApiClient = axios.create({
  baseURL: `${API_BASE_URL}:8765/payment-processing-service`, // Base URL for the payment-processing-service
});

paymentApiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default paymentApiClient;
