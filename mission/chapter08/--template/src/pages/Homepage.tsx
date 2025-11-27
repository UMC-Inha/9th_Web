import { useMemo, useState, useEffect, useRef } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";
import { PAGINATION_ORDER } from "../enums/common";
import useInfiniteLpList from "../hooks/queries/useInfiniteLpList";
import ErrorState from "../components/ErrorState";
import type { ResponseLpListDto } from "../types/lp";

import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";
import useSidebar from "../hooks/useSidebar";
import Sidebar from "../components/Sidebar";

export default function Homepage() {

  const { isOpen, close, toggle } = useSidebar();

  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  useEffect(() => {
    // 사용자가 타이핑을 멈추면 debounced 값이 search로 반영되어 자동 검색
    setSearch(debouncedInput);
  }, [debouncedInput]);

  const {
    data,
    isPending,              // 초기 로딩
    isError,
    hasNextPage,
    isFetchingNextPage,     // 추가 로딩
    fetchNextPage,
    refetch,
  } = useInfiniteLpList({ search, order: sort });

  const initialRef = useRef(true);

  useEffect(() => {
    if (!initialRef.current) return;
    initialRef.current = false;

    if (!search || search.trim().length === 0) {
      //enabled 옵션이 false인 경우 수동으로 refetch 호출
      console.log("[Homepage] initial mount: manual refetch()");
      refetch()
        .then((res) => console.log("[Homepage] refetch result:", res))
        .catch((err) => console.error("[Homepage] refetch error:", err));
    }
  }, [refetch, search]);

  const toggleSort = () =>
    setSort((s) => (s === PAGINATION_ORDER.desc ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc));

  const pages = (data as InfiniteData<ResponseLpListDto> | undefined)?.pages ?? [];
  const list = useMemo(() => pages.flatMap((p) => p?.data?.data ?? []), [pages]);
  // sentinel node state (use callback ref so observer attaches when element mounts)
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const [shouldFetchOnScroll, setShouldFetchOnScroll] = useState(false);
  const throttledShouldFetch = useThrottle(shouldFetchOnScroll, 600);

  useEffect(() => {
    // 디버그: throttled 값 변화 추적 및 fetch 호출 로깅
    if (throttledShouldFetch) {
      console.log("[Homepage] Throttled fetch trigger activated.");
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
          .then((res) => console.log("[Homepage] fetchNextPage result:", res))
          .catch((err) => console.error("[Homepage] fetchNextPage error:", err))
          .finally(() => setShouldFetchOnScroll(false));
      } else {
        // 조건 때문에 호출하지 않은 경우라도 flag는 리셋
        setShouldFetchOnScroll(false);
      }
    }
  }, [throttledShouldFetch, hasNextPage, isFetchingNextPage, fetchNextPage]);


  useEffect(() => {
    const el = sentinel;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldFetchOnScroll(true);
          }
        });
      },
      { root: null, rootMargin: "500px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [sentinel]);
  
  // 초기 로딩: 그리드 상단에 카드 스켈레톤
  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end px-1">
          <div className="inline-flex rounded-full border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
            정렬 로딩…
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState message="목록을 불러오지 못했습니다." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Sidebar isOpen={isOpen} onClose={close} />
      {/* 검색 입력 + 우측 상단 정렬 토글 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* 햄버거 메뉴: 사이드바 토글 */}
          <button
            type="button"
            onClick={() => toggle()}
            aria-label="Open sidebar"
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-800"
          >

          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearch(input);
              }
            }}
            placeholder="검색어를 입력하세요"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-pink-500"
          />
          <button
            type="button"
            onClick={() => setSearch(input)}
            className="rounded-md bg-pink-600 px-3 py-2 text-sm text-white hover:bg-pink-500"
          >
            검색
          </button>
        </div>
        {/* 우측: 정렬 토글 */}
      <div className="flex justify-end">
        <div role="tablist" aria-label="정렬" className="inline-flex overflow-hidden rounded-full border border-neutral-700">
          <button
            type="button"
            role="tab"
            aria-selected={sort === PAGINATION_ORDER.asc}
            onClick={() => setSort(PAGINATION_ORDER.asc)}
            className={
              "px-3 py-1.5 text-sm " +
              (sort === PAGINATION_ORDER.asc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            오래된순
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sort === PAGINATION_ORDER.desc}
            onClick={() => setSort(PAGINATION_ORDER.desc)}
            className={
              "px-3 py-1.5 text-sm border-l border-neutral-700 " +
              (sort === PAGINATION_ORDER.desc ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800")
            }
          >
            최신순
          </button>
          <button
            type="button"
            onClick={toggleSort}
            className="px-3 py-1.5 text-sm border-l border-neutral-700 bg-black text-white hover:bg-neutral-800"
            aria-label="정렬 토글"
            title="정렬 토글"
          >
            ↕︎
          </button>
        </div>
        </div>
      </div>

      {/* 카드 그리드 */}
      {list.length === 0 ? (
        <div className="text-neutral-400">결과가 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {list.map((lp: any) => (
              <LpCard
                key={lp.id}
                lp={{
                  id: lp.id,
                  title: lp.title,
                  createdAt: lp.createdAt as unknown as string,
                  coverUrl: lp.thumbnail ?? null,
                  likes: Array.isArray(lp.likes) ? lp.likes.length : 0,
                }}
              />
            ))}
            {/* 추가 로딩 시, 하단에 카드 스켈레톤 붙이기 */}
            {isFetchingNextPage &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
          </div>
          <div className="flex flex-col items-center py-6">
            {hasNextPage ? (
              <>
                <div ref={setSentinel} className="w-full h-1" />
                {isFetchingNextPage ? (
                  <div className="mt-3 text-sm text-neutral-400">불러오는 중…</div>
                ) : null}
              </>
            ) : (
              <span className="text-neutral-500 text-sm">모든 결과를 불러왔습니다.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
