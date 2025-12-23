// @ts-nocheck
import axios from 'axios';
import { BASE_URL } from '@/config';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (cookie sẽ tự động được gửi đi vì withCredentials: true)
        const refreshResponse = await api.post('/auth/refresh-token');

        // Backend trả về accessToken mới
        const { accessToken } = refreshResponse.data.data;

        // Lưu token mới
        localStorage.setItem('accessToken', accessToken);

        // Gắn token mới vào header của request ban đầu
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Gọi lại request ban đầu
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi (hết hạn refresh token), logout user
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
