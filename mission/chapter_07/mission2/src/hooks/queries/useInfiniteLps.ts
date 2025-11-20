// 📁 src/hooks/queries/useInfiniteLps.ts
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchLps, type FetchLpsResponse } from "../../apis/lps.js";

export function useInfiniteLps(order: "asc" | "desc") {
  return useInfiniteQuery<
    FetchLpsResponse, // ❗ 각 요청의 반환 타입
    Error, // ❗ 에러 타입
    InfiniteData<FetchLpsResponse> // ❗ 최종 data 타입 (중요!!!)
  >({
    queryKey: ["lps", order],

    queryFn: ({ pageParam }) =>
      fetchLps(order, pageParam as number | undefined),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,

    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });
}
