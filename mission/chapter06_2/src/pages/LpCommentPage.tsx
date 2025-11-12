import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { LpCommentsData } from '../types/comments'; 
import { formatDistanceToNowStrict } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getComments, postComments } from '../apis/comment';
import LpCommentSkeleton from '../components/LpCommentSkeleton';

interface CommentCardProps {
    comment: LpCommentsData; 
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
    const authorName = comment.author?.name || '익명';
    
    const timeAgo = formatDistanceToNowStrict(new Date(comment.createdAt), {
        addSuffix: true,
        locale: ko,
    });

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow">
            <div className="flex justify-between items-center mb-1">
                <p className="font-bold text-pink-300"> {authorName} </p>
                <p className="text-xs text-gray-400"> {timeAgo} </p>
            </div>
            <p className="text-white"> {comment.content} </p>
        </div>
    );
};

interface CommentInputProps {
    lpId: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ lpId }) => {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: postComments, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
            setContent('');
        },
        
        onError: (error) => {
            console.error("댓글 작성 실패:", error);
            alert(`댓글 작성에 실패했습니다.`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() === '') return;
        
        mutation.mutate({ lpId, content });
    };

    return (
        <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-700 gap-2">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:border-pink-500"
                disabled={mutation.isPending}
            />
            <button
                type="submit"
                className="bg-pink-500 text-black font-bold px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={content.trim() === '' || mutation.isPending}
            >
                {mutation.isPending ? '등록 중...' : '등록'}
            </button>
        </form>
    );
};

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
                <div className='flex flex-1 right-0 gap-3'>
                    <button className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'>
                        오래된순
                    </button>
                    <button
                    className='bg-pink-500 text-black rounded-sm w-22 h-10 font-bold'>
                        최신순
                    </button>
                </div>
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
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