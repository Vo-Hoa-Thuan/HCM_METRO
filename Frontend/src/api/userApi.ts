import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
  headers: { "Content-Type": "application/json" },
});

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
    return [];
  }
};
