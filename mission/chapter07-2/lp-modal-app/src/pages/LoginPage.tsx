import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async () => {
      localStorage.setItem("token", "yes");
      return true;
    },
    onSuccess: () => navigate("/"),
  });

  return (
    <div style={{ padding: 40 }}>
      <h2>로그인</h2>
      <button style={{ padding: 10 }} onClick={() => login.mutate()}>
        로그인하기
      </button>
    </div>
  );
}
