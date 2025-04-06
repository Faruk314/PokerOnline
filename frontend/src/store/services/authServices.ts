import apiClient from "../../utils/apiClient";
import { UserData } from "../../types/types";

const API_URL = "/api/auth/";

const login = async (userData: UserData) => {
  const response = await apiClient.post(API_URL + "login", userData);
  return response.data;
};

const register = async (userData: UserData) => {
  const response = await apiClient.post(API_URL + "register", userData);

  return response.data;
};

const getLoginStatus = async () => {
  const response = await apiClient.get(API_URL + "getLoginStatus");

  return response.data;
};

const logout = async () => {
  const response = await apiClient.get(API_URL + "logout");

  return response.data;
};

const authService = {
  login,
  register,
  getLoginStatus,
  logout,
};

export default authService;
