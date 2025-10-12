
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const qrApiClient = axios.create({
  baseURL: `${API_BASE_URL}:7002`,
  withCredentials: true,
});

export default qrApiClient;
