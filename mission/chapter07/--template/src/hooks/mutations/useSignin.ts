import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { setAccessToken } from "../../apis/token";
import type { RequestSigninDto } from "../../types/auth";

export function useSignin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: RequestSigninDto) => postSignin(body),
    onSuccess: (data) => {
      const token = data?.data?.accessToken;
      if (token) {
        setAccessToken(token);
        // me 쿼리 무효화하여 즉시 갱신
        qc.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
}

