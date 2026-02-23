import axiosInstance from "./axiosInstance";

export const login = async (data) => {
  return await axiosInstance.post("/auth/login", data);
};