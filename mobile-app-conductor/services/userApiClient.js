
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "./apiConfig";

const userApiClient = axios.create({
  baseURL: `${API_BASE_URL}:8765`, // Base URL for the user-management-service
});

userApiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userApiClient;
