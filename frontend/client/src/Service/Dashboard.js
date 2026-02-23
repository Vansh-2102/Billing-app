import axiosInstance from "./axiosInstance";

export const fetchDashboardData = async () => {
  return await axiosInstance.get("/dashboard");
};