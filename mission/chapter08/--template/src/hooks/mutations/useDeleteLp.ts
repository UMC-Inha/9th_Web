import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constans/key";

export function useDeleteLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      // LP 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

