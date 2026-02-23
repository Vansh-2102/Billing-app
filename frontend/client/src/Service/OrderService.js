import axiosInstance from "./axiosInstance";

export const latestOrders = async () => {
  return await axiosInstance.get("/orders/latest");
};

export const createOrder = async (order) => {
  return await axiosInstance.post("/orders", order);
};

export const deleteOrder = async (id) => {
  return await axiosInstance.delete(`/orders/${id}`);
};