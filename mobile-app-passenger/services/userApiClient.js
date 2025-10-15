import axios from "axios";
import API_BASE_URL from "./apiConfig";

const userApiClient = axios.create({
  baseURL: `${API_BASE_URL}:7000`,
  withCredentials: true,
});

export default userApiClient;