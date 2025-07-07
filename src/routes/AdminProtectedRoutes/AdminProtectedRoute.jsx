import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectCurrentAdmin,
  selectAdminToken,
} from "../../Stores/Slices/admin.slices";

const AdminProtectedRoute = () => {
  const admin = useSelector(selectCurrentAdmin);
  const token = useSelector(selectAdminToken);

  if (!admin || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
