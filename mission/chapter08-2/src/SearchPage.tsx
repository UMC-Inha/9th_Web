import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useThrottle } from "./useThrottle";
import {
  fetchSearchResults,
} from "./api";
import type {
  SearchResponse,
  SearchResultItem,
} from "./api";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // 🔥 throttle (입력값)
  const throttledQuery = useThrottle(query, 300);

  const queryResult = useInfiniteQuery({
    queryKey: ["search", throttledQuery],
    queryFn: ({ pageParam }) =>
      fetchSearchResults({
        query: throttledQuery,
        cursor: pageParam ?? null,
      }),
    initialPageParam: null,
    enabled: throttledQuery.trim().length > 0,
    getNextPageParam: (lastPage: SearchResponse) => lastPage.nextCursor,
    staleTime: 60000,
    gcTime: 600000,
  });

  const data = queryResult.data;

  const items: SearchResultItem[] =
    data?.pages.flatMap((p) => p.items) ?? [];

  // 🔥 스크롤 위치 감지 핸들러 (Throttle 적용)
  const throttledScrollHandler = useThrottle(0, 150); // 단순 trigger용

  const handleScroll = useCallback(() => {
    const scrollPosition =
      window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 300; // 300px 남으면 로딩

    if (scrollPosition >= bottom) {
      if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
        queryResult.fetchNextPage();
      }
    }
  }, [queryResult]);

  // 🔥 스크롤 이벤트 바인딩
  useEffect(() => {
    const listener = () => {
      // throttle trigger
      throttledScrollHandler;
      handleScroll();
    };

    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, [handleScroll, throttledScrollHandler]);

  return (
    <div style={{ padding: 20 }}>
      <h2>검색 (자동 무한스크롤 + Throttle)</h2>

      <input
        type="text"
        value={query}
        placeholder="검색어 입력"
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      {queryResult.isLoading && <p>검색 중...</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "6px 0" }}>
            {item.name}
          </li>
        ))}
      </ul>

      {queryResult.isFetchingNextPage && <p>더 불러오는 중...</p>}

      {!queryResult.hasNextPage && items.length > 0 && (
        <p style={{ marginTop: 20, textAlign: "center" }}>
          마지막 페이지입니다
        </p>
      )}
    </div>
  );
}
