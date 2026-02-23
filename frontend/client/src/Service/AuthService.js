import axiosInstance from "./axiosInstance";

export const login = async (data) => {
  return await axiosInstance.post("/login", data);
};