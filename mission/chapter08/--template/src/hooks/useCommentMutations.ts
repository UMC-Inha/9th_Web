import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment, deleteComment } from "../apis/comments";

export function useCreateLpComment(lpId: number, order: "asc" | "desc") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ content, token }: { content: string; token: string }) =>
      createComment(lpId, content, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}

export function useUpdateLpComment(lpId: number, order: "asc" | "desc") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      content,
      token,
    }: {
      commentId: number;
      content: string;
      token: string;
    }) => updateComment(lpId, commentId, content, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}

export function useDeleteLpComment(lpId: number, order: "asc" | "desc") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, token }: { commentId: number; token: string }) =>
      deleteComment(lpId, commentId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}
