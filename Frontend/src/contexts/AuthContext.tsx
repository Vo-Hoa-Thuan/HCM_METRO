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
  
  

//   // 🔄 Tự động refresh token mỗi 9 giây (vì token cũ hết hạn sau 10 giây)
//   useEffect(() => {
//     const interval = setInterval(() => {
//         refreshAccessToken();
//     }, 9 * 60 * 1000); // 🔄 Refresh mỗi 9 phút
//     return () => clearInterval(interval);
// }, []);


  const login = async (phoneNumber, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", { phoneNumber, password },  { withCredentials: true } );

      if (data?.accessToken) {
        console.log("🔥 Access Token mới:", data.accessToken);
        console.log("🔥 Refresh Token mới:", data.refreshToken);

        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
  
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        setUser({ token: data.accessToken, isAuthenticated: true }); // ✅ Cập nhật user đúng
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      const expiredToken = localStorage.getItem("accessToken");
      console.log("🕒 Kiểm tra token cũ:", expiredToken);
  
      try {
        const response = await axios.get("http://localhost:5000/protected-route", {
          headers: { Authorization: `Bearer ${expiredToken}` },
        });
        console.log("✅ Token cũ vẫn hoạt động:", response.data);
      } catch (error) {
        console.error("❌ Token cũ bị từ chối:", error.response?.status, error.response?.data);
      }
    }, 11000); // Test sau 11 giây (token đã hết hạn)
  }, []);
  

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
