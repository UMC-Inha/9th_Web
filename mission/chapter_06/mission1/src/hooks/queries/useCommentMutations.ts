import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../apis/comments";

export function useCommentMutations(lpId: number, order: "asc" | "desc") {
  const queryClient = useQueryClient();
  const commentKey = ["lpComments", lpId, order];

  // 댓글 생성
  const create = useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  // 댓글 수정
  const update = useMutation({
    mutationFn: (data: { commentId: number; content: string }) =>
      updateComment(lpId, data.commentId, data.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  // 댓글 삭제
  const remove = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  return { create, update, remove };
}
