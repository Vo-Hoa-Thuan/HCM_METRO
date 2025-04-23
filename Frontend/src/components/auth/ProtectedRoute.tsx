import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  const isAuthenticated = user?.isAuthenticated === true;

  console.log("🔥 isAuthenticated:", isAuthenticated);
  console.log("⏳ Loading:", loading);
  console.log("📌 Children:", children);
  
  useEffect(() => {
    console.log("user:", user);
    console.log("loading:", loading);
  }, [user, loading]);

  if (loading) return <h1>🔄 Đang tải...</h1>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // if (user.role !== "admin" && user.role !== "user") {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
