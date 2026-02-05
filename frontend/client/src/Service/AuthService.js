import axios from "axios"; // ✅ correct import

export const login = async (data) => {
  return await axios.post(
    "http://localhost:8080/api/v1.0/login",
    data
  );
};
