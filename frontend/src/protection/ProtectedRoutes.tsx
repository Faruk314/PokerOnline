import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const ProtectedRoutes = () => {
  const { loggedUserInfo, fetchingLoginState } = useAppSelector(
    (state) => state.auth
  );

  if (fetchingLoginState) return null;

  return loggedUserInfo ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
