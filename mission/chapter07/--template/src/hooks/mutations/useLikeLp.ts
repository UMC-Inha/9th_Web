import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeLp, unlikeLp } from "../../apis/lp";
import type { ResponseLpDetailDto } from "../../types/lp";
import type { Likes } from "../../types/lp";
import { useMe } from "../queries/useMe";
import { QUERY_KEY } from "../../constans/key";

export function useLikeLp(lpId: number) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      // 실제 캐시 상태 확인 (409 에러 방지)
      const currentLp = queryClient.getQueryData<ResponseLpDetailDto>(["lp", lpId]);
      if (currentLp?.data && me) {
        const currentLikes = currentLp.data.likes || [];
        const actuallyLiked = currentLikes.some((like) => like.userId === me.id);
        
        // 상태가 이미 올바르면 API 호출하지 않고 성공으로 처리 (409 방지)
        if (isLiked && !actuallyLiked) {
          // 좋아요 취소 시도했지만 실제로는 좋아요가 없음 -> 이미 올바른 상태
          return Promise.resolve({ data: null }); // 성공으로 처리
        }
        if (!isLiked && actuallyLiked) {
          // 좋아요 추가 시도했지만 실제로는 이미 좋아요가 있음 -> 이미 올바른 상태
          return Promise.resolve({ data: currentLikes.find((like) => like.userId === me.id) || null }); // 성공으로 처리
        }
      }
      
      // isLiked가 true면 좋아요 취소 (unlike), false면 좋아요 추가 (like)
      return isLiked ? unlikeLp(lpId) : likeLp(lpId);
    },
    onMutate: async (isLiked) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      // 이전 값 저장 (롤백용)
      const previousLp = queryClient.getQueryData<ResponseLpDetailDto>(["lp", lpId]);

      // Optimistic Update: 좋아요 상태 즉시 변경
      if (previousLp?.data && me) {
        queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], (old) => {
          if (!old?.data) return old;

          const currentLikes = old.data.likes || [];
          const userId = me.id;
          
          // 실제 캐시 상태 확인 (클라이언트가 전달한 isLiked와 다를 수 있음)
          const actuallyLiked = currentLikes.some((like) => like.userId === userId);

          if (isLiked) {
            // 좋아요 취소 시도
            // 실제로 좋아요가 없으면 API 호출하지 않고 그대로 반환 (409 방지)
            if (!actuallyLiked) {
              return old; // 변경하지 않음
            }
            // 좋아요 취소: likes 배열에서 현재 사용자 제거
            const newLikes = currentLikes.filter((like) => like.userId !== userId);
            return {
              ...old,
              data: {
                ...old.data,
                likes: newLikes,
              },
            };
          } else {
            // 좋아요 추가 시도
            // 실제로 이미 좋아요가 있으면 API 호출하지 않고 그대로 반환 (409 방지)
            if (actuallyLiked) {
              return old; // 변경하지 않음
            }
            // 좋아요 추가: likes 배열에 현재 사용자 추가
            const newLike: Likes = {
              id: Date.now(), // 임시 ID (서버 응답 후 실제 ID로 교체됨)
              userId: userId,
              lpId: lpId,
            };
            return {
              ...old,
              data: {
                ...old.data,
                likes: [...currentLikes, newLike],
              },
            };
          }
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousLp };
    },
    onError: (err: any, _isLiked, context) => {
      // Optimistic Update 롤백
      if (context?.previousLp) {
        queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], context.previousLp);
      }
      
      // 404, 409 에러는 상태가 이미 올바른 것이므로 조용히 처리
      if (err?.response?.status === 404 || err?.response?.status === 409) {
        // 서버 상태로 동기화
        queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        // 활성 쿼리는 즉시 refetch하여 서버 상태로 확실히 동기화
        queryClient.refetchQueries({ queryKey: ["lp", lpId], type: "active" });
        return;
      }
      
      // 다른 에러는 서버 상태로 동기화
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
    onSuccess: () => {
      // 성공 시 모든 관련 쿼리 무효화하여 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      // 활성 쿼리는 즉시 refetch하여 서버 상태로 확실히 동기화
      queryClient.refetchQueries({ queryKey: ["lp", lpId], type: "active" });
    },
  });
}

