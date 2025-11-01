// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // 1) 로컬스토리지에서 토큰 가져오기
  const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  // setItem 할 때 JSON으로 넣었으니까 꺼낼 때도 파싱
  const token = rawToken ? JSON.parse(rawToken) : null;

  // 2) 토큰이 없으면 로그인 페이지로 보냄
  if (!token) {
    return (
      <Navigate
        to="/login" // ← 너희 로그인 페이지 경로로 바꿔
        replace
        state={{ from: location }} // ← 나중에 로그인 후 원래 페이지로 보내줄 때 씀
      />
    );
  }

  // 3) 토큰 있으면 원래 컴포넌트 보여주기
  return <>{children}</>;
}
