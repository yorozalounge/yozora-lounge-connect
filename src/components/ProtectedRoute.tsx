import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requiredRole?: "client" | "talent" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-yozora flex items-center justify-center">
        <p className="text-ivory-muted text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "talent" ? "/talent-dashboard" : "/client-dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;