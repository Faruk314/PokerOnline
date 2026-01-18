import apiClient from "../../utils/apiClient";

const API_URL = "/api/payment/";

const createPaymentIntent = async (data: { packageId: string; amount: number; price: number }) => {
  const response = await apiClient.post(API_URL + "createPaymentIntent", {
    packageId: data.packageId,
  });

  return response.data;
};

const paymentService = {
  createPaymentIntent,
};

export default paymentService;
