import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { Likes, ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onMutate: async (lp) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp],
      });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp,
      ]);

      const newLpPost = { ...previousLpPost };

      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);

      const Index =
        previousLpPost?.data.likes.findIndex(
          (like) => like.userId === userId
        ) ?? -1;

      if (Index >= 0) {
        previousLpPost?.data.likes.splice(Index, 1);
      } else {
        const newLike = { userId, lpId: lp } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }

      queryClient.setQueryData([QUERY_KEY.lps, lp], newLpPost);

      return { previousLpPost, newLpPost };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp],
        context?.previousLpPost?.data.id
      );
    },

    onSettled: async (variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables],
      });
    },
  });
}

export default useDeleteLike;
