// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const userStr = localStorage.getItem("user");

  // 🔒 1️⃣ 완전 로그아웃 or 저장 안 된 상태
  if (!userStr) {
    alert("로그인 후 이용 가능합니다.");
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // 🔒 2️⃣ JSON 구조 이상하거나 nickname 없음
    if (!user || !user.nickname) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("user");
      return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    // ✅ 3️⃣ 정상 로그인
    return <>{children}</>;
  } catch (error) {
    // 🔒 4️⃣ JSON.parse 실패한 경우 (깨진 값)
    console.error("Invalid user data in localStorage:", error);
    localStorage.removeItem("user");
    alert("로그인 정보가 손상되었습니다. 다시 로그인해주세요.");
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
}
