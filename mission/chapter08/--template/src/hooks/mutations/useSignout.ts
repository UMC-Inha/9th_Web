import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSignout } from "../../apis/auth";
import { clearAccessToken } from "../../apis/token";
import { LOCAL_STORAGE_KEY } from "../../constans/key";

export function useSignout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => postSignout(),
    onSuccess: () => {
      // 토큰 제거
      clearAccessToken();
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      // me 쿼리 제거
      qc.removeQueries({ queryKey: ["me"] });
    },
  });
}

