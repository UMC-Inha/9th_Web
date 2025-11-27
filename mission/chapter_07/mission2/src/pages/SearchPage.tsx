import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useThrottle } from "../hooks/useThrottle";
import { useSearchLpsQuery } from "../hooks/queries/useSearchLpsQuery";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [scrollY, setScrollY] = useState(0);

  const debouncedQuery = useDebounce(search, 300);
  const throttledScrollY = useThrottle(scrollY, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchLpsQuery(debouncedQuery);

  const flat = data?.pages?.flatMap((p) => p.data.data) ?? [];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const nearBottom = scrollHeight - (scrollTop + clientHeight) < 120;

    if (nearBottom) fetchNextPage();
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="border px-3 py-2 w-full rounded"
      />

      {isLoading && debouncedQuery && <p>검색 중...</p>}

      <div className="mt-6 space-y-3">
        {flat.map((lp) => (
          <div key={lp.id} className="p-4 border rounded">
            <p className="text-lg font-semibold">{lp.title}</p>
            <p className="text-gray-600 text-sm">{lp.content}</p>
          </div>
        ))}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-2 border rounded mt-3"
          >
            {isFetchingNextPage ? "로딩 중..." : "더 불러오기"}
          </button>
        )}
      </div>
    </div>
  );
}
