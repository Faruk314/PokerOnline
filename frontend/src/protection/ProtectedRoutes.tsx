import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const ProtectedRoutes = () => {
  const { loggedUserInfo } = useAppSelector((state) => state.auth);

  if (!loggedUserInfo) {
    return null;
  }

  return loggedUserInfo ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
