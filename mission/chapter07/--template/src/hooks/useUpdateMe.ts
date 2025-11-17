// src/hooks/mutations/useUpdateMe.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe, type UpdateMePayload } from "../apis/users";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import type { Me } from "./queries/useMe";

const ME_QUERY_KEYS = [
  ["me"],
  ["/v1/users/me"],
  ["auth", "me"],
];

export default function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMePayload) => updateMe(payload),
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소
      const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
      await qc.cancelQueries({ queryKey: ["me", token] });

      // 이전 값 저장 (롤백용)
      const previousMe = qc.getQueryData<Me | null>(["me", token]);

      // Optimistic Update: 새로운 값으로 즉시 업데이트
      if (previousMe) {
        qc.setQueryData<Me | null>(["me", token], (old) => {
          if (!old) return old;
          return {
            ...old,
            name: newData.name,
            bio: newData.bio ?? old.bio,
            // avatar는 파일 업로드가 완료되어야 하므로 여기서는 업데이트하지 않음
            // 서버 응답 후 업데이트됨
          };
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousMe, token };
    },
    onError: (err, newData, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousMe && context?.token) {
        qc.setQueryData<Me | null>(["me", context.token], context.previousMe);
      }
    },
    onSuccess: () => {
      // 성공 시 쿼리 무효화하여 서버 데이터로 갱신
      ME_QUERY_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k as any }));
    },
  });
}
