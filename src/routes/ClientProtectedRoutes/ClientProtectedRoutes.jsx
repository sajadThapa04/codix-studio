// routes/ClientProtectedRoutes/ClientProtectedRoutes.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthInitialized,
} from "../../Stores/Slices/client.slices";

const ClientProtectedRoutes = () => {
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  if (!isInitialized) {
    return <div>Loading authentication...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ClientProtectedRoutes;
