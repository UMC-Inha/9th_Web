import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import type { CreateLpPayload } from "../../types/auth";
import { QUERY_KEY } from "../../constans/key";

export function useUpdateLp(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLpPayload) => updateLp(lpId, payload),
    onSuccess: () => {
      // LP 상세와 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

