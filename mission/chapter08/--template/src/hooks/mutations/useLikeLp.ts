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
      return isLiked ? unlikeLp(lpId) : likeLp(lpId);
    },
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      const previousLp = queryClient.getQueryData<ResponseLpDetailDto>(["lp", lpId]);

      if (previousLp?.data && me) {
        queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], (old) => {
          if (!old?.data) return old;

          const currentLikes = old.data.likes || [];
          const userId = me.id;

          if (isLiked) {
            const newLikes = currentLikes.filter((like) => like.userId !== userId);
            return {
              ...old,
              data: {
                ...old.data,
                likes: newLikes,
              },
            };
          } else {
            const newLike: Likes = {
              id: Date.now(),
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

      return { previousLp };
    },
    onError: (_err, _isLiked, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpId], context.previousLp);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

