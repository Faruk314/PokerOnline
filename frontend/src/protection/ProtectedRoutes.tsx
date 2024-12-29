import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Loader from "../components/Loader";

const ProtectedRoutes = () => {
  const { loggedUserInfo, fetchingLoginState } = useAppSelector(
    (state) => state.auth
  );

  if (fetchingLoginState) {
    return <Loader />;
  }

  return loggedUserInfo ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
