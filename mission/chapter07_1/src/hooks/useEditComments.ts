import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComments } from "../apis/comment";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useEditComment = (lpId: number, onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchComments,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpComments(lpId) });
        onSuccess?.();
        },
        onError: () => {
        alert("댓글 수정에 실패하였습니다. 다시 시도해주세요.");
        },
    });
};