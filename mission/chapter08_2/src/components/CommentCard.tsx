import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { LpCommentsData } from "../types/comments";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDeleteComment } from "../hooks/useDeleteComments";
import { useEditComment } from "../hooks/useEditComments";


interface CommentCardProps {
    comment: LpCommentsData;
    lpId: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, lpId }) => {
    const { userId } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editComment, setEditComment] = useState(comment.content);

    const isAuthor = userId !== null && comment.authorId === Number(userId);

    const editMutation = useEditComment(lpId, () => setIsEditing(false));
    const deleteMutation = useDeleteComment(lpId);

    const handleEditComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (editComment.trim() === "") return;

        editMutation.mutate({
        lpId,
        commentId: comment.id,
        content: editComment,
        });
    };

    const handleDeleteComment = () => {
        if (window.confirm("해당 댓글을 삭제하시겠습니까?")) {
        deleteMutation.mutate({
            lpId,
            commentId: comment.id,
        });
        }
    };

    const timeAgo = formatDistanceToNowStrict(new Date(comment.createdAt), {
        addSuffix: true,
        locale: ko,
    });

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow ml-20 mr-20">
        <div className="flex flex-1 justify-between items-center mb-1">
            <div className="flex right-0 gap-2">
            <p className="font-bold text-[18px] text-pink-300">
                {comment.author.name}
            </p>
            <p className="text-xs text-gray-400">{timeAgo}</p>
            </div>

            {isAuthor && (
            <div className="flex right-0 gap-2">
                <button onClick={() => setIsEditing(true)}>수정</button>
                <button onClick={handleDeleteComment}>삭제</button>
            </div>
            )}
        </div>

        {isEditing ? (
            <form onSubmit={handleEditComment} className="flex gap-2 mt-1 items-center">
            <input
                type="text"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="flex-1 bg-gray-800 text-white w-15 p-2 rounded border border-gray-600 focus:outline-none"
            />
            <button
                type="submit"
                className="bg-pink-500 text-pink-900 w-15 h-8 rounded font-bold hover:text-white"
                disabled={editMutation.isPending}
            >
                저장
            </button>
            <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 rounded font-bold text-gray-800 w-15 h-8 hover:text-white"
            >
                취소
            </button>
            </form>
        ) : (
            <p className="text-white mt-1">{comment.content}</p>
        )}
        </div>
    );
};

export default CommentCard;
