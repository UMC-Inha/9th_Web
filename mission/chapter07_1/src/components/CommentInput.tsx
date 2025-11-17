import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postComments } from "../apis/comment";

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
        <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-700 gap-2 pl-25 pr-25">
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

export default CommentInput;