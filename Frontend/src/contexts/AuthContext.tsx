import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setUser({ token: storedToken, isAuthenticated: true });
    }

    // Kiểm tra nếu đăng nhập Google
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("📌 Nhận token từ Google:", token);

      localStorage.setItem("accessToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({ token, isAuthenticated: true });

      // Xóa token khỏi URL để tránh lưu trữ trong lịch sử trình duyệt
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setLoading(false);
  }, []);

  // 🔥 Hàm refresh token tự động
  const refreshAccessToken = async () => {
    try {
      // Gửi request mà không cần refreshToken từ localStorage
      const { data } = await axios.post("http://localhost:5000/auth/refresh", {}, { withCredentials: true });
  
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        // ✅ Cập nhật user
      setUser({
        token: data.accessToken,
        isAuthenticated: true, // ⚠ Đảm bảo có thuộc tính này
      });}
    } catch (error) {
      console.error("Lỗi refresh token:", error);
      logout(); // Đăng xuất nếu refresh thất bại
    }
  };
  
  // 🔄 Tự động refresh token mỗi 9 giây (vì token cũ hết hạn sau 10 giây)
  useEffect(() => {
    const interval = setInterval(() => {
        refreshAccessToken();
    }, 9 * 60 * 1000); // 🔄 Refresh mỗi 9 phút
    return () => clearInterval(interval);
}, []);


  const login = async (phoneNumber, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", { phoneNumber, password },  { withCredentials: true } );

      if (data?.accessToken) {
        console.log("🔥 Access Token mới:", data.accessToken);
        console.log("🔥 Refresh Token mới:", data.refreshToken);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
  
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        setUser({ token: data.accessToken, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data?.message || error.message);
    }
  };

  // 🔑 Đăng nhập bằng Google (chuyển hướng)
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };


 // 🚪 Đăng xuất
 const logout = async () => {
  try {
    await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }

  localStorage.removeItem("accessToken");
  delete axios.defaults.headers.common["Authorization"];
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user?.isAuthenticated || false, login, logout, loginWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
