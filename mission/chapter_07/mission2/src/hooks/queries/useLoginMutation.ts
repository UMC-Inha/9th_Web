import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth.js";
import { useAuth } from "../../contexts/AuthContext.js";
import { useNavigate, useLocation } from "react-router-dom";

export function useLoginMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: postSignin,

    onSuccess: (res) => {
      login(res.data); // ⭐ access / refresh token 저장 (AuthContext 방식)
      alert("로그인 성공!");

      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    },

    onError: () => {
      alert("❌ 로그인 실패! 이메일 또는 비밀번호를 확인해주세요.");
    },
  });
}
