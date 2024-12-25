import apiClient from "../../utils/apiClient";

const API_URL = "/api/shop/";

const fetchShopPackages = async () => {
  const response = await apiClient.get(API_URL + "fetchShopPackages");

  return response.data;
};

const shopService = {
  fetchShopPackages,
};

export default shopService;
