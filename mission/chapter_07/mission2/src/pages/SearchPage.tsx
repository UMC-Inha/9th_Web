import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchLpsQuery } from "../hooks/queries/useSearchLpsQuery";

export default function SearchPage() {
  const [search, setSearch] = useState("");

  // 🔥 debounce 적용 (300ms 권장)
  const debouncedQuery = useDebounce(search, 300);

  // 🔥 검색 hook 연동
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchLpsQuery(debouncedQuery);

  // 평탄화
  const flat = data?.pages?.flatMap((p) => p.data.data) ?? [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="border px-3 py-2 w-full rounded"
      />

      {/* 요청 중일 때 */}
      {isLoading && debouncedQuery && <p>검색 중...</p>}

      {/* 검색 결과 */}
      <div className="mt-6 space-y-3">
        {flat.map((lp) => (
          <div key={lp.id} className="p-4 border rounded">
            <p className="text-lg font-semibold">{lp.title}</p>
            <p className="text-gray-600 text-sm">{lp.content}</p>
          </div>
        ))}

        {/* 더보기 */}
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
