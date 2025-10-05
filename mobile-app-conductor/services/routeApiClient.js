
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "./apiConfig";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}:7001`, // Base URL for the route-fare-management-service
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
