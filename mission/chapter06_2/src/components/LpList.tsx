import React, { useEffect, useState } from 'react'
import { LpData } from '../types/lps'
import { getLps } from '../apis/lps';
import LpCard from './LpCard';
import { useQuery } from '@tanstack/react-query';
import LpCardSkeleton from './LpCardSkeleton';

const LpList = () => {
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');
    const [cursor, setCursor] = useState<number | null>(0);

    const { data : response, isLoading, isError, error, refetch } = useQuery({
        queryKey : ['lps', order, cursor],
        queryFn : () => getLps({ cursor: cursor ?? 0, limit: 10, search: "", order: order }),
        staleTime : 1000 * 60 * 5,
        gcTime : 1000 * 60 * 10,
    })

    const lps : LpData[] = response?.data?.data || [];

    const nextCursor = response?.data?.nextCursor;

    const handleSort = () => {
        setOrder(current => (current === 'desc' ? 'asc' : 'desc'));
        setCursor(0);
    }

    if (isError) {
        return (
            <div>
                오류가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 오류'}
                <button onClick={() => refetch()}>
                    재시도
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-5 mt-15 justify-center'>
            <div className='flex flex-1 gap-3'>
                {isLoading && (
                    <div className='flex flex-1 gap-3'>
                        <button className='text-black bg-gray-300 animate-pulse rounded-sm w-22 h-10 font-bold'>
                        </button>
                        <button className='text-black bg-gray-300 animate-pulse rounded-sm w-22 h-10 font-bold'>
                        </button>
                    </div>
                )}

                {!isLoading && (
                    <div className='flex flex-1 gap-3'>
                        <button
                            onClick={handleSort}
                            className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'
                        >
                            {order === 'desc' ? '오래된순' : '최신순'}
                        </button>
                        <button
                            disabled={!nextCursor}
                            onClick={() => setCursor(nextCursor ?? 0)}
                            className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'
                        >
                            ➔
                        </button>
                    </div>
                )}
            </div>

            <div className='grid grid-cols-5 gap-4'>
                { isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <LpCardSkeleton key={i} />
                        ))
                    ) : (
                        lps.map((lp) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default LpList
