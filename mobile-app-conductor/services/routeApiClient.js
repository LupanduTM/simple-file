
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}:7001`,
  withCredentials: true,
});

export default apiClient;
