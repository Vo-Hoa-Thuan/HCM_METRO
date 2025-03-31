import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Đường dẫn có thể khác tùy dự án

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
