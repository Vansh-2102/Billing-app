import axiosInstance from "./axiosInstance";

export const addUser = async (user) => {
  return await axiosInstance.post("/admin/register", user);
};

export const deleteUser = async (id) => {
  return await axiosInstance.delete(`/admin/users/${id}`);
};

export const fetchUsers = async () => {
  return await axiosInstance.get("/admin/users");
};