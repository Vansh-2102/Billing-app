import axiosInstance from "./axiosInstance";

export const createRazorpayOrder = async (data) => {
  return await axiosInstance.post("/payments/create-order", data);
};

export const verifyPayment = async (paymentData) => {
  return await axiosInstance.post("/payments/verify", paymentData);
};