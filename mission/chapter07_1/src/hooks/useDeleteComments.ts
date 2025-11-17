import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComments } from "../apis/comment";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useDeleteComment = (lpId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComments,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpComments(lpId) });
        },
        onError: () => {
        alert("댓글 삭제에 실패하였습니다. 다시 시도해주세요.");
        },
    });
};