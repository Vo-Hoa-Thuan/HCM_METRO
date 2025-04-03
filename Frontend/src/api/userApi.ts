import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'User' | 'Moderator' | 'Admin';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      app: boolean;
    };
    language: string;
  };
  lastActive?: string;
  createdAt: string;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getAllUsers = async () => {
  try {
    console.log("🟢 Đang gọi API:", `${API_URL}/users`);
    const response = await axios.get(`${API_URL}/users`);
    console.log("✅ API trả về:", response.data);

    return response.data || []; // Trả về mảng rỗng nếu không có dữ liệu
  } catch (error) {
    console.error("❌ Lỗi gọi API:", error.message);
    console.error("📌 Chi tiết lỗi:", error.response ? error.response.data : error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};



export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw error;
  }
};

export const updateUserPreferences = async (id: string, preferencesData: any) => {
  try {
    const response = await api.put(`/users/${id}/preferences`, preferencesData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user preferences ${id}:`, error);
    throw error;
  }
};

export const exportUsers = async () => {
  try {
    const response = await api.get('/users/export');
    return response.data;
  } catch (error) {
    console.error('Failed to export users:', error);
    throw error;
  }
};
