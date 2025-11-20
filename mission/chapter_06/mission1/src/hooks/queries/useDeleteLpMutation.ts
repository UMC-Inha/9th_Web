import { useMutation } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lps";
import { useNavigate } from "react-router-dom";

export function useDeleteLpMutation(lpId: number) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      navigate("/lps"); // 리스트로 이동
    },
    onError: () => alert("LP 삭제 중 오류가 발생했습니다."),
  });
}
