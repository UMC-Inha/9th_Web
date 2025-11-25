import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: "asc" | "desc"
) {
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search: trimmedSearch, order }),
    queryKey: [QUERY_KEY.lps, trimmedSearch, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
