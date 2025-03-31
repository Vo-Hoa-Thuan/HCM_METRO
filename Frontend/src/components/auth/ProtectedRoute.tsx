import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  console.log("🔥 isAuthenticated:", !!user);
  console.log("⏳ Loading:", loading);
  console.log("📌 Children:", children);

  if (loading) return <h1>🔄 Đang tải...</h1>;
  
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
