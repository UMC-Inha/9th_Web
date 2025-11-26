import { useState, useEffect, useRef, Key } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lps';
import LpCard from './LpCard';
import LpCardSkeleton from './LpCardSkeleton';
import SearchBar from './SearchBar';
import { LpData } from '../types/lps';
import { useInView } from 'react-intersection-observer';
import useThrottle from '../hooks/useThrottle';

const LpList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>("desc");

    const scrollRef = useRef<HTMLDivElement>(null);

    const { ref: sentinelRef, inView } = useInView({
        rootRef: scrollRef,
        rootMargin: '0px',
        threshold: 0.1,
    });

    const {
        data: allData,
        isLoading: isAllLoading,
        fetchNextPage: fetchNextAllPage,
        hasNextPage: hasNextAllPage,    
        isFetchingNextPage: isFetchingNextAllPage, 
    } = useInfiniteQuery({
        queryKey: ["lps", "all", order],
        queryFn: ({ pageParam = 0 }) =>
            getLps({
                cursor: pageParam,
                limit: 10,
                order,
                search: "",
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
        enabled: searchQuery.trim() === "",
    });

    const {
        data: searchData,
        isLoading: isSearchLoading,
        fetchNextPage: fetchNextSearchPage,
        hasNextPage: hasNextSearchPage,
        isFetchingNextPage: isFetchingNextSearchPage,
    } = useInfiniteQuery({
        queryKey: ["lps", "search", searchQuery, order],
        queryFn: ({ pageParam = 0 }) =>
            getLps({
                cursor: pageParam,
                limit: 10,
                search: searchQuery,
                order,
            }),
        initialPageParam: 0,
        enabled: searchQuery.trim() !== "",
        getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    });

    const isSearching = searchQuery.trim() !== "";

    const items: LpData[] = isSearching
        ? searchData?.pages.flatMap(p => p.data.data) ?? []
        : allData?.pages.flatMap(p => p.data.data) ?? [];

    const isLoading = isSearching ? isSearchLoading : isAllLoading;
    const isFetchingMore = isSearching ? isFetchingNextSearchPage : isFetchingNextAllPage;
    const hasMore = isSearching ? hasNextSearchPage : hasNextAllPage;
    const loadMore = isSearching ? fetchNextSearchPage : fetchNextAllPage;

    const throttleLoadMore = useThrottle(() => {
        if (hasMore && !isFetchingMore) {
            loadMore();
        }
    }, 500);

    const showInitialLoading = isLoading && items.length === 0 && !isFetchingMore;

    useEffect(() => {
        if (inView) {
            throttleLoadMore();
        }
    }, [inView]);

    return (
        <div className="flex flex-col h-screen mt-30 overflow-hidden"> 
            <div className="sticky top-0 z-10 p-4 bg-white flex justify-between items-center">
                <SearchBar onSearch={setSearchQuery} />
                <button
                    onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                    className="bg-pink-500 text-black rounded-sm w-22 h-10 font-bold"
                >
                    {order === "desc" ? "오래된순" : "최신순"}
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto px-4 mt-5">
                <div className="grid grid-cols-5 gap-4">
                    {!showInitialLoading && items.map(lp => (
                        <LpCard key={lp.id} lp={lp} />
                    ))}

                    {showInitialLoading &&
                        Array.from({ length: 10 }).map((_: any, i: Key | null | undefined) => (
                            <LpCardSkeleton key={i} />
                        ))
                    }

                    {isFetchingMore &&
                        Array.from({ length: 10 }).map((_: any, i: Key | null | undefined) => (
                            <LpCardSkeleton key={i} />
                        ))
                    }
                </div>

                <div ref={sentinelRef} className="h-100" />
            </div>
        </div>
    );
};

export default LpList;
