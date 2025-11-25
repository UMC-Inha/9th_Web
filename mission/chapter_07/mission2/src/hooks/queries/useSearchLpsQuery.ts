import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchLps, type FetchLpsResponse } from "../../apis/lps";

export function useSearchLpsQuery(query: string) {
  return useInfiniteQuery<
    FetchLpsResponse,
    Error,
    InfiniteData<FetchLpsResponse>
  >({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) =>
      fetchLps("desc", pageParam as number | undefined, 10, query),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    enabled: query.trim().length > 0,
    staleTime: 1000 * 5,
    gcTime: 1000 * 60 * 5,
  });
}
