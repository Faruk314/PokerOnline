import apiClient from "../../utils/apiClient";

const API_URL = "/api/payment/";

const createCheckoutSession = async (packageId: number) => {
  const response = await apiClient.post(API_URL + "createCheckoutSession", {
    packageId,
  });

  return response.data;
};

const paymentService = {
  createCheckoutSession,
};

export default paymentService;
