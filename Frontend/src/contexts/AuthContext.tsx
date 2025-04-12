import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const name = queryParams.get("name");
    const role = queryParams.get("role");
    // const id = queryParams.get("id");
  
    if (token && name && role) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("name", decodeURIComponent(name));
      localStorage.setItem("role", role);
      // localStorage.setItem("userId", id); 
      // console.log("Id", id)
      console.log("role", role)
      console.log("name", decodeURIComponent(name))
      console.log("Id", token)
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({
        token,
        name: decodeURIComponent(name),
        role,
        isAuthenticated: true,
        // id,
      });
  

      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem("accessToken");
      const storedName = localStorage.getItem("name");
      const storedRole = localStorage.getItem("role");
      const storedId = localStorage.getItem("id");
  
      if (storedToken && storedName && storedRole) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        setUser({
          token: storedToken,
          name: storedName,
          role: storedRole,
          id: storedId,
          isAuthenticated: true,
        });
      } else {
        setUser({ isAuthenticated: false }); 
      }
    }
  
    setLoading(false);
  }, []);
  
  

  const refreshAccessToken = async () => {
    try {
      // Gửi request mà không cần refreshToken từ localStorage
      const { data } = await axios.post("http://localhost:5000/auth/refresh", {}, { withCredentials: true });
  
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        // ✅ Cập nhật user
      setUser({
        token: data.accessToken,
        isAuthenticated: true,
        name: data.name,
        role: data.role,
        id: data.id,
      });}
    } catch (error) {
      console.error("Lỗi refresh token:", error);
      logout(); 
    }
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
        refreshAccessToken();
    }, 9 * 60 * 1000);
    return () => clearInterval(interval);
}, []);


  const login = async (phoneNumber, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", { phoneNumber, password },  { withCredentials: true } );

      if (data?.accessToken) {
        console.log("🔥 Access Token mới:", data.accessToken);
        console.log("🔥 Refresh Token mới:", data.refreshToken);
        console.log("🔥 Tên:", data.name);
        console.log("🔥 Id:", data.id);
        console.log("🔥 role:", data.role);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("userId", data.id);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
  
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        setUser({ token: data.accessToken, isAuthenticated: true , name: data.name, role: data.role, id: data.id});
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
  localStorage.removeItem("name");
  localStorage.removeItem("role");
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
