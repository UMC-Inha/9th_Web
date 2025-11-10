import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다 ! 로그인 해주세용");
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="flex flex-col h-dvh justify-center items-center text-center">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
