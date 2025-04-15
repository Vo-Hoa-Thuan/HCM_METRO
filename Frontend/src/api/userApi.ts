import axios from "axios";

const API_URL = "http://localhost:5000";

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interface cho User
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'staff' | 'admin';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive?: string;
  createdAt: string;
  signupType: string;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('Unauthorized. Please log in again.');
    } else if (error.response?.status === 403) {
      console.error('You do not have permission to perform this action.');
    }
    return Promise.reject(error);
  }
);


export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("accessToken"); 
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`; 
    }

    const response = await api.get(`/users`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to get users:', error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

// Hàm lấy người dùng theo ID
export const getUserById = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.get(`/users/${id}`);
    if (!response.data) {
      console.error(`User with id ${id} not found`);
      throw new Error('User not found');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

// Hàm tạo người dùng
export const createUser = async (userData: Partial<User>) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.post(`/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

// Hàm cập nhật người dùng
export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

// Hàm xóa người dùng
export const deleteUser = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken"); 
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};



// Hàm cập nhật sở thích người dùng
export const updateUserPreferences = async (id: string, preferencesData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.put(`/users/${id}/preferences`, preferencesData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user preferences ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

// Hàm xuất danh sách người dùng
export const exportUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.get('/users/export');
    return response.data;
  } catch (error) {
    console.error('Failed to export users:', error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};


// 🔍 Hàm lấy số lượng người dùng mới theo mốc thời gian
export const getNewUsersByTimeRange = async (range: 'day' | 'week' | 'month' | 'year') => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api.get(`/users/new-users/stats?range=${range}`);
    return response.data; // { range: 'day', count: 5 }
  } catch (error) {
    console.error('Failed to get new user stats:', error);
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

