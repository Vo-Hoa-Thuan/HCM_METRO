import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;

      // Nếu bị 403 -> Thử refresh token
      if (status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("🔄 Đang thử refresh token...");
          const { data } = await axios.get("http://localhost:5000/auth/refresh", {
            withCredentials: true,
          });

          console.log("✅ Refresh thành công:", data);
          API.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

          return API(originalRequest);
        } catch (refreshError) {
          console.error("❌ Refresh token thất bại:", refreshError.response?.data || refreshError.message);
          return Promise.reject(refreshError);
        }
      }

      // Nếu bị 401 -> Logout luôn
      if (status === 401) {
        console.warn("🚨 Token hết hạn, đăng xuất...");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
