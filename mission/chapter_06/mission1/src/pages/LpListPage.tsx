// 📁 src/pages/LpListPage.tsx
import { useState } from "react";
import { useInfiniteLps } from "../hooks/queries/useInfiniteLps";
import type { LpItem } from "../apis/lps";
import LpCard from "../components/LpCard";
import ErrorState from "../components/ErrorState";
import LpWriteModal from "../components/LpWriteModal";
export default function LpsListPage() {
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteLps(sort);

  // 🔥 여러 페이지에 흩어진 LP들을 한 배열로 평탄화
  const list: LpItem[] = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h2 className="text-xl font-semibold mb-4">LP 목록</h2>

      {/* 정렬 버튼 */}
      <button
        onClick={() => setSort((p) => (p === "desc" ? "asc" : "desc"))}
        className="px-3 py-2 border rounded hover:bg-gray-50"
      >
        정렬: {sort === "desc" ? "최신순" : "오래된순"}
      </button>

      {isFetching && <span className="ml-2 text-gray-500">⏳ 동기화 중</span>}

      {/* ⬆️ 상단 스켈레톤 (첫 페이지 로딩) */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={`top-skeleton-${i}`}
              className="animate-pulse bg-gray-200 rounded-lg aspect-video"
            />
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

      {/* 실제 카드 렌더링 */}
      {!isLoading && !isError && (
        <>
          {list.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              표시할 LP가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {list.map((lp: LpItem) => (
                <LpCard key={lp.id} item={lp} />
              ))}
            </div>
          )}

          {/* ⬇️ 하단 스켈레톤 (다음 페이지 로딩 중) */}
          {isFetchingNextPage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`bottom-skeleton-${i}`}
                  className="animate-pulse bg-gray-200 rounded-lg aspect-video"
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-pink-600 text-white text-3xl flex justify-center items-center"
          >
            +
          </button>

          {open && <LpWriteModal onClose={() => setOpen(false)} />}
          {/* 다음 페이지 불러오기 버튼 */}
          {hasNextPage && (
            <div className="flex justify-center mt-6 mb-8">
              <button
                onClick={() => fetchNextPage()}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                더 보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
