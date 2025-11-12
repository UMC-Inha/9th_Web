import React, { useEffect, useState } from 'react'
import { LpData } from '../types/lps'
import { getLps } from '../apis/lps';
import LpCard from './LpCard';
import { useQuery } from '@tanstack/react-query';

const LpList = () => {
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');

    const { data : response, isLoading, isError, error, refetch } = useQuery({
        queryKey : ['lps', order],
        queryFn : () => getLps({ cursor: 0, limit: 10, search: "", order: order }),
        staleTime : 1000 * 60 * 5,
        gcTime : 1000 * 60 * 10
    })

    const lps : LpData[] = response?.data?.data || [];

    const handleSort = () => {
        setOrder(current => (current === 'desc' ? 'asc' : 'desc'));
    }


    if (isLoading) {
        return (
            <div>
                로딩 중
            </div>
        )
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
        <>
            <div className='mb-4'>
                <button
                    onClick={handleSort}
                    className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'
                >
                    {order === 'desc' ? '오래된순' : '최신순'}
                </button>
            </div>

            <div className='grid grid-cols-5 gap-4'>
                {lps.map((lp) => (
                    <LpCard key={lp.id} lp={lp} />
                ))}
            </div>
        </>
    )
}

export default LpList
