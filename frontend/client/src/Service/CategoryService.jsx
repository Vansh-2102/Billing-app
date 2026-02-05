import axiosInstance from "./axiosInstance";

export const addCategory = (category) => {
  // Don't set Content-Type header - let browser set it with boundary for FormData
  return axiosInstance.post("/categories/admin", category);
};

export const deleteCategory = (categoryId) => {
  return axiosInstance.delete(`/categories/admin/${categoryId}`);
};

export const fetchCategories = () => {
  return axiosInstance.get("/categories");
};
