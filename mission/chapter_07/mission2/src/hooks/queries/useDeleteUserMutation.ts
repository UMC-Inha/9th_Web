import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios.js";
import { useAuth } from "../../contexts/AuthContext.js";

export function useDeleteUserMutation() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete("/v1/users/me");
    },
    onSuccess: () => {
      logout();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    },
    onError: () => {
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });
}
