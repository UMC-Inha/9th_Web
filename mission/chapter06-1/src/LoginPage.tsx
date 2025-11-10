import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface LoginPageProps {
  setUser: React.Dispatch<React.SetStateAction<{ nickname: string } | null>>;
}

export default function LoginPage({ setUser }: LoginPageProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectPath = params.get("redirect") || "/";

  const handleLogin = () => {
    const fakeUser = { nickname: "오타나인" };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);

    alert("로그인 성공! 🎉");
    navigate(redirectPath, { replace: true });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>로그인 페이지</h2>
      <button onClick={handleLogin}>임시 로그인</button>
    </div>
  );
}
