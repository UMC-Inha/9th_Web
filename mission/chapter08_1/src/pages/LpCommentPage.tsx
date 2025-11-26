import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { LpCommentsData } from '../types/comments'; 
import { getComments } from '../apis/comment';
import LpCommentSkeleton from '../components/LpCommentSkeleton';
import CommentCard from '../components/CommentCard';
import CommentInput from '../components/CommentInput';

const LpCommentPage = () => {
    const { id } = useParams<{ id: string }>();
    const lpId = Number(id);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['lpComments', lpId],
        queryFn: ({ pageParam }) => getComments({ lpId, cursor: pageParam, limit: 10, order: 'desc' }),
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        initialPageParam: undefined, 
        enabled: !isNaN(lpId) && lpId > 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const comments : LpCommentsData[] = data?.pages.flatMap(page => page.data.data) ?? [];

    if (isLoading) {
        return <div className="bg-black text-white h-screen w-full text-center p-10">로딩 중...</div>;
    }

    if (isError) {
        return <div className="bg-red-500 text-white h-screen w-full text-center p-10">오류: {error instanceof Error ? error.message : '알 수 없는 오류'}</div>;
    }

    return (
        <div className="flex flex-col bg-black h-screen w-full text-white">
            <div className="flex flex-col mt-15 overflow-y-auto p-4 space-y-4 p-10">
                <div className='flex flex-1 right-0 gap-3 pl-20'>
                    <button className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'>
                        오래된순
                    </button>
                    <button
                    className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'>
                        최신순
                    </button>
                </div>
                {comments.map((comment) => (
                    <CommentCard 
                    key={comment.id} 
                    comment={comment} 
                    lpId={Number(lpId)}
                    />
                ))}

                {comments.length === 0 && !isFetchingNextPage && (
                    <div className="text-center text-gray-400 p-10">
                        <p> 첫 댓글을 남겨보세요 ✍️ </p>
                    </div>
                )}

                <div ref={ref} className="h-1 w-full" />

                {isFetchingNextPage && (
                    <div className="text-center p-4">
                        <LpCommentSkeleton />
                    </div>
                )}

                {!hasNextPage && comments.length > 0 && (
                    <div className="text-center text-gray-500 p-4">
                        <p>마지막 댓글입니다.</p>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 bg-black z-10">
                <CommentInput lpId={lpId} />
            </div>
        </div>
    );
}

export default LpCommentPage;