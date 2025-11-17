import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments, type CommentItem } from "../../apis/comments";

export interface InfiniteCommentsResponse {
  data: CommentItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export function useInfiniteComments(lpId: number, order: "asc" | "desc") {
  return useInfiniteQuery<
    InfiniteCommentsResponse, // 서버에서 받아오는 실제 데이터 타입
    Error, // error 타입
    InfiniteCommentsResponse, // 최종적으로 반환받을 데이터 타입
    [string, number, string] // queryKey 타입 (⭐ 추가!)
  >({
    queryKey: ["lpComments", lpId, order],

    queryFn: ({ pageParam }) =>
      getComments(
        lpId,
        (pageParam as number | undefined) ?? undefined,
        10,
        order
      ),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,

    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });
}
