import apiClient from "../../utils/apiClient";

const API_URL = "/api/payment/";

const createCheckoutSession = async (packageId: string) => {
  const response = await apiClient.post(API_URL + "createCheckoutSession", {
    packageId,
  });

  return response.data;
};

const createPaymentIntent = async (data: { packageId: string; amount: number; price: number }) => {
  const response = await apiClient.post(API_URL + "createPaymentIntent", {
    packageId: data.packageId,
  });

  return response.data;
};

const paymentService = {
  createCheckoutSession,
  createPaymentIntent,
};

export default paymentService;
