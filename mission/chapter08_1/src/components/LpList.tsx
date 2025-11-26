import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lps';
import LpCard from './LpCard';
import LpCardSkeleton from './LpCardSkeleton';
import SearchBar from './SearchBar';
import { LpData } from '../types/lps';

const LpList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>("desc");

    const {
        data: allData,
        isLoading: isAllLoading,
        isError: isAllError,
        fetchNextPage,
        hasNextPage,
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
        isError: isSearchError,
        fetchNextPage: fetchNextSearchPage,
        hasNextPage: hasNextSearchPage,
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
        ? searchData?.pages.flatMap((p) => p.data.data) ?? []
        : allData?.pages.flatMap((p) => p.data.data) ?? [];

    const isLoading = isSearching ? isSearchLoading : isAllLoading;
    const loadMore = isSearching ? fetchNextSearchPage : fetchNextPage;
    const hasMore = isSearching ? hasNextSearchPage : hasNextPage;

    return (
        <div className="flex flex-col gap-5 mt-15 justify-center">
            <div className="flex flex-1 justify-between">
                <SearchBar onSearch={setSearchQuery} />

                <div className='flex gap-5'>
                    <button
                        onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                        className="bg-pink-500 text-black rounded-sm w-22 h-10 font-bold"
                    >
                        {order === "desc" ? "오래된순" : "최신순"}
                    </button>

                    <button
                        disabled={!hasMore}
                        onClick={() => loadMore()}
                        className="bg-pink-500 text-black rounded-sm w-22 h-10 font-bold"
                    >
                        ➔
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <LpCardSkeleton key={i} />
                    ))
                    : items.map((lp) => <LpCard key={lp.id} lp={lp} />)}
            </div>
        </div>
    );
};

export default LpList;
