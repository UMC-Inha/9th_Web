import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { fetchSearchResults } from "./api";
import type {
  SearchResponse,
  SearchResultItem,
} from "./api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const queryResult = useInfiniteQuery<
    SearchResponse,     // TData
    Error,              // TError
    SearchResponse,     // TQueryFnData
    [string, string],   // TQueryKey
    string | null       // TPageParam
  >({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ pageParam }) =>
      fetchSearchResults({
        query: debouncedQuery,
        cursor: pageParam ?? null,
      }),
    initialPageParam: null,
    enabled: debouncedQuery.trim().length > 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
  });

  const data = queryResult.data as InfiniteData<SearchResponse> | undefined;

  const items: SearchResultItem[] =
    data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div style={{ padding: 20 }}>
      <h2>검색</h2>
      <input
        type="text"
        value={query}
        placeholder="검색어를 입력하세요"
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      {queryResult.isLoading && <p>불러오는 중...</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "8px 0" }}>
            {item.name}
          </li>
        ))}
      </ul>

      {queryResult.hasNextPage && (
        <button
          onClick={() => queryResult.fetchNextPage()}
          disabled={queryResult.isFetchingNextPage}
        >
          {queryResult.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </button>
      )}
    </div>
  );
}
