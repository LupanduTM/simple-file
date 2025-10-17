
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const userApiClient = axios.create({
  baseURL: `${API_BASE_URL}:7000`,
  withCredentials: true,
});

export const updatePassword = async (userId, newPassword) => {
  const response = await userApiClient.put(`/api/v1/users/${userId}/password`, {
    newPassword,
  });
  return response.data;
};

export default userApiClient;
