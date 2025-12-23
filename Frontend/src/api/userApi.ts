import api from "./axiosInstance";

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

export const getAllUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await api.post(`/users`, userData);
    return response.data; // Create/Update usually return success msg or the obj. My controller returns { status: 'success', message:..., userId:... }.
    // If frontend expects data, it might need adjustment. But usually create returns the created obj or ID.
    // Controller returns: { status: 'success', message: "Đăng ký bằng SĐT thành công", userId: newUser._id } for register/create.
    // Frontend might rely on result properties.
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data || response.data; // Update returns { status: 'success', message:..., user:..., data: user }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data; // { status: 'success', message: '...' }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const updateUserPreferences = async (id: string, preferencesData: any) => {
  try {
    const response = await api.put(`/users/${id}/preferences`, preferencesData);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const exportUsers = async () => {
  try {
    const response = await api.get('/users/export');
    return response.data; // Export might differ, usually download blob?
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const getNewUsersByTimeRange = async (range: 'day' | 'week' | 'month' | 'year') => {
  try {
    const response = await api.get(`/users/new-users/stats?range=${range}`);
    return response.data.data || response.data; // { status: success, data: { timeRange, count } }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};

export const changePassword = async (id: string, oldPassword: string, newPassword: string) => {
  try {
    const response = await api.put(`/users/${id}/change-password`, {
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unknown error');
  }
};
