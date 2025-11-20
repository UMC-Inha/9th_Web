import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lps";

export function useUpdateLpMutation(lpId: number, onSuccess?: VoidFunction) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { title?: string; content?: string; tags?: string[] }) =>
      updateLp(lpId, dto),
    onSuccess: () => {
      alert("LP가 수정되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] }); // 상세 재요청
      onSuccess?.();
    },
    onError: () => alert("LP 수정 중 오류가 발생했습니다."),
  });
}
