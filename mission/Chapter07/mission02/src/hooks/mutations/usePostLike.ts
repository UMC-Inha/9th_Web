import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { Likes, ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    onMutate: async (lp) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp],
      });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp,
      ]);

      //피드백 반영 : 완전히 새로운 객체(newLpPost)를 만들어 Optimistic Update에서만 사용한다.
      const newLpPost: ResponseLpDto = {
        //전체 외부 필드 복사
        ...previousLpPost!,
        data: {
          //data 객체 자체도 새로운 객체로 만들어 참조 끊기
          ...previousLpPost!.data,
          //likes 배열을 깊은 복사
          likes: [...previousLpPost!.data.likes],
        },
      };

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

export default usePostLike;
