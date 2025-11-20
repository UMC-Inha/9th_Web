import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLogoutMutation() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      logout(); // ⭐ 토큰 제거 + 상태 초기화
    },
    onSuccess: () => {
      alert("로그아웃되었습니다.");
      navigate("/login", { replace: true });
    },
  });
}
