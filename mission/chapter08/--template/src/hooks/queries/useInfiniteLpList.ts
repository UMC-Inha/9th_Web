import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";
import { QUERY_KEY } from "../../constans/key";

/**
 * 무한 스크롤용 LP 목록 훅
 * queryKey: [QUERY_KEY.lps, order]
 * pageParam(=cursor)은 number | undefined 로 고정
 */
export default function useInfiniteLpList({
  search,
  order,
  limit,
}: Pick<PaginationDto, "search" | "order" | "limit">) {
  return useInfiniteQuery<
    ResponseLpListDto, // TQueryFnData
    Error, // TError
    ResponseLpListDto, // TData
    [string, typeof order, string | undefined], // TQueryKey (lps, order, search)
    number | undefined // TPageParam
  >({
    // search를 queryKey에 포함하여 검색어가 바뀌면 쿼리가 갱신되도록 함
    queryKey: [QUERY_KEY.lps, order, search],
    enabled: !!(search && search.trim().length > 0),

    initialPageParam: undefined, // 첫 페이지는 cursor 없음
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, search, order, limit }), //
    getNextPageParam: (lastPage) => {
      const next =
        (lastPage as any)?.data?.nextCursor ??
        (lastPage as any)?.data?.cursor?.next ??
        null;

      return typeof next === "number" ? next : undefined; //  number만 반환(없으면 undefined)
    },
    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,
  });
}
