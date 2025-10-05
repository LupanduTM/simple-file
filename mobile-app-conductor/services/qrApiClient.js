
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "./apiConfig";

const qrApiClient = axios.create({
  baseURL: `${API_BASE_URL}:7002`, // Base URL for the qr-code-generation-service
});

qrApiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default qrApiClient;
