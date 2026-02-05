import axiosInstance from "./axiosInstance";

export const addItem = (itemData, file) => {
  const formData = new FormData();
  formData.append("item", JSON.stringify(itemData));
  formData.append("file", file);
  
  return axiosInstance.post("/admin/items", formData);
};

export const fetchItems = () => {
  return axiosInstance.get("/items");
};

export const deleteItem = (itemId) => {
  return axiosInstance.delete(`/admin/items/${itemId}`);
};
