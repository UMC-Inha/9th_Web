import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeLp, unlikeLp } from "../../apis/likes";

export const isLikedByMe = (lp: any, meId: number) =>
  lp.likes?.some((l: any) => l.userId === meId) ?? false;

export function useToggleLpLikeMutation(lpId: number, meId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isLiked }: { isLiked: boolean }) => {
      return isLiked ? unlikeLp(lpId) : likeLp(lpId);
    },

    onMutate: async ({ isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      const previous = queryClient.getQueryData(["lp", lpId]);

      queryClient.setQueryData(["lp", lpId], (old: any) => ({
        ...old,
        likes: isLiked
          ? old.likes.filter((l: any) => l.userId !== meId)
          : [...old.likes, { lpId, userId: meId }],
      }));

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["lp", lpId], ctx.previous);
      }
      alert("❌ 좋아요 처리 실패, 롤백되었습니다.");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      queryClient.invalidateQueries({ queryKey: ["likes", "me"] });
    },
  });
}
