// 📁 src/pages/LpDetailPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { InfiniteData } from "@tanstack/react-query";

import { useLpDetailQuery } from "../hooks/queries/useLpDetailQuery";
import { useInfiniteComments } from "../hooks/queries/useInfiniteComments";
import { useCommentMutations } from "../hooks/queries/useCommentMutations";
import { useDeleteLpMutation } from "../hooks/queries/useDeleteLpMutation";
import { useUpdateLpMutation } from "../hooks/queries/useUpdateLpMutation";
import type { CommentItem, CommentListResponse } from "../apis/comments";
import { useAuth } from "../contexts/AuthContext";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const lpId = Number(lpid);
  const { user } = useAuth();
  const myUserId = user?.id;

  const [order, setOrder] = useState<"asc" | "desc">("asc");

  /** LP 상세 조회 */
  const {
    data: lp,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useLpDetailQuery(lpId);

  /** LP 수정/삭제 Mutation */
  const { mutate: deleteLpMutate } = useDeleteLpMutation(lpId);
  const { mutate: updateLpMutate } = useUpdateLpMutation(lpId);

  /** ⭐ LP 삭제 버튼 */
  function handleDeleteLp() {
    if (confirm("정말 게시글을 삭제하시겠습니까?")) deleteLpMutate();
  }

  /** ⚠️ 수정 모달 구현 예정 → 지금은 안내만 */
  function handleEditLp() {
    alert("✏ 수정 모달은 아직 구현되지 않았습니다!");
  }

  /** 댓글 관련 훅 */
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteComments(lpId, order);

  /** 댓글 생성/수정/삭제 mutation */
  const { create, update, remove } = useCommentMutations(lpId, order);

  /** 평탄화된 댓글 리스트 */
  const flatComments: CommentItem[] =
    (
      (comments as InfiniteData<CommentListResponse> | undefined)?.pages ?? []
    ).flatMap((p) => p.data) ?? [];

  /** 댓글 입력/수정 상태 */
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  /** 댓글 작성 */
  function handleSubmit() {
    if (!input.trim()) return alert("댓글을 입력해 주세요!");
    create.mutate(input, { onSuccess: () => setInput("") });
  }

  /** 댓글 수정 시작 */
  function startEdit(commentId: number, content: string) {
    setEditingId(commentId);
    setEditText(content);
  }

  /** 댓글 수정 저장 */
  function handleSaveEdit(commentId: number) {
    update.mutate(
      { commentId, content: editText },
      { onSuccess: () => setEditingId(null) }
    );
  }

  /** 댓글 삭제 */
  function handleDeleteComment(commentId: number) {
    if (!confirm("정말 댓글을 삭제하시겠습니까?")) return;
    remove.mutate(commentId);
  }

  if (isLoading) return <Loading />;
  if (isError || !lp) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* 제목 */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{lp.title}</h1>
        {isFetching && (
          <span className="text-sm text-gray-500">⏳ 동기화 중…</span>
        )}
      </header>

      {/* 수정/삭제 버튼 */}
      <div className="flex gap-3 pt-3">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleEditLp}
        >
          ✏ 수정
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleDeleteLp}
        >
          🗑 삭제
        </button>
      </div>

      {/* 작성자 & 날짜 */}
      <div className="text-gray-600 text-sm">
        ✍ {lp.author?.name ?? "알 수 없음"} ·{" "}
        {new Date(lp.createdAt).toLocaleString()}
      </div>

      {/* 썸네일 */}
      {lp.thumbnail && <img src={lp.thumbnail} className="rounded-md w-full" />}

      {/* 본문 */}
      <p className="leading-relaxed whitespace-pre-wrap">{lp.content}</p>

      {/* 좋아요 수 */}
      <div className="text-pink-600 font-semibold">
        ❤️ {lp.likes?.length ?? 0} 개
      </div>

      {/* ====== 댓글 영역 ====== */}
      <section className="pt-10 space-y-4">
        <h2 className="text-xl font-semibold">💬 댓글</h2>

        {/* 정렬 */}
        <button
          onClick={() => setOrder((p) => (p === "asc" ? "desc" : "asc"))}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          정렬: {order === "asc" ? "⏳ 오래된순" : "🆕 최신순"}
        </button>

        {/* 댓글 입력 */}
        <div className="flex gap-2 pt-4">
          <input
            className="border flex-1 px-3 py-2 rounded"
            value={input}
            placeholder="댓글을 입력하세요"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="px-4 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            등록
          </button>
        </div>

        {/* 댓글 목록 */}
        {flatComments.length === 0 ? (
          <p className="text-gray-500 py-6 text-center">
            아직 댓글이 없습니다.
          </p>
        ) : (
          flatComments.map((c) => (
            <div key={c.id} className="border-b py-3">
              {editingId === c.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border rounded"
                  />
                  <button
                    className="text-blue-600 text-sm mt-1"
                    onClick={() => handleSaveEdit(c.id)}
                  >
                    저장
                  </button>
                </>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{c.content}</p>
              )}

              <span className="text-xs text-gray-500">
                ✍ {c.author.name} · {new Date(c.createdAt).toLocaleString()}
              </span>

              {/* 본인이 작성한 댓글일 경우에만 수정/삭제 */}
              {c.author.id === myUserId && (
                <div className="text-xs space-x-2 mt-1">
                  <button
                    className="text-pink-500"
                    onClick={() => startEdit(c.id, c.content)}
                  >
                    수정
                  </button>
                  <button
                    className="text-pink-500"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {isFetchingNextPage && (
          <div className="animate-pulse h-12 bg-gray-200 rounded" />
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="w-full border py-2 rounded hover:bg-gray-100"
          >
            ⬇️ 댓글 더 보기
          </button>
        )}
      </section>

      <Link to="/lps" className="inline-block text-pink-600 underline mt-10">
        ← 목록으로 돌아가기
      </Link>
    </div>
  );
}
