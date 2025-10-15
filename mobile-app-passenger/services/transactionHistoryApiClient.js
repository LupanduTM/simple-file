import axios from "axios";
import API_BASE_URL from "./apiConfig";

const transactionHistoryApiClient = axios.create({
  baseURL: `${API_BASE_URL}:7004`,
  withCredentials: true,
});

export default transactionHistoryApiClient;
