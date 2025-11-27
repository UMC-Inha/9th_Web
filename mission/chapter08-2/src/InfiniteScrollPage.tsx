import { useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useThrottle } from "./useThrottle";
import { fetchItems } from "./api";
import type { PageResponse, Item } from "./api";

export default function InfiniteScrollPage() {
  const trigger = useThrottle(0, 200);

  const queryResult = useInfiniteQuery<
    PageResponse,
    Error,
    PageResponse,
    ["items"],
    string | null
  >({
    queryKey: ["items"],
    queryFn: ({ pageParam }) => fetchItems({ cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
    gcTime: 600_000,
  });

  const data = queryResult.data as InfiniteData<PageResponse> | undefined;

  const items: Item[] =
    data?.pages.flatMap((p) => p.items) ?? [];

  const handleScroll = useCallback(() => {
    const scrollPosition =
      window.innerHeight + window.scrollY;
    const bottom = document.body.offsetHeight - 300;

    if (scrollPosition >= bottom) {
      if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
        queryResult.fetchNextPage();
      }
    }
  }, [queryResult]);

  useEffect(() => {
    const listener = () => {
      trigger; // throttle trigger
      handleScroll();
    };

    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, [handleScroll, trigger]);

  return (
    <div style={{ padding: 20 }}>
      <h2>무한스크롤</h2>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "10px 0" }}>
            {item.title}
          </li>
        ))}
      </ul>

      {queryResult.isFetchingNextPage && <p>로딩 중...</p>}
      {!queryResult.hasNextPage && <p>마지막 페이지입니다</p>}
    </div>
  );
}
