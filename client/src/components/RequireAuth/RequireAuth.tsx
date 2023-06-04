import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRole }: RequireAuthProps) => {
  const { auth }: any = useAuth();
  const location = useLocation();

  return allowedRole.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

interface RequireAuthProps {
  allowedRole: string[];
}

export default RequireAuth;
