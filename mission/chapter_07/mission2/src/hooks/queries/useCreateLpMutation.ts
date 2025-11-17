import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp, type CreateLpRequest } from "../../apis/lps.js";

export function useCreateLpMutation(onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLpRequest) => createLp(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });

      // 🔥 LP 등록 성공 시 모달 닫기 추가
      onClose();

      alert("LP가 성공적으로 등록되었습니다!");
    },

    onError: (err: any) => {
      console.log("🔥 서버 응답 전체:", err);
      console.log("🔥 서버 응답 data:", err.response?.data);
      console.log("🔥 서버 응답 message:", err.response?.data?.message);
      alert("LP 등록 오류!");
    },
  });
}
