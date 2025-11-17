import { useMemo, useState, useEffect } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteLpComments from "../hooks/queries/useInfiniteLpComments";
import { createComment, updateComment, deleteComment } from "../apis/comments";
import type { ResponseLpCommentsDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";
import { useAuthUser } from "../hooks/useAuthUser";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constans/key";

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <div className="h-9 w-9 rounded-full bg-neutral-800 animate-pulse" />
      <div className="flex-1">
        <div className="h-3 w-32 rounded bg-neutral-800 animate-pulse mb-2" />
        <div className="h-3 w-3/4 rounded bg-neutral-800 animate-pulse mb-1" />
        <div className="h-3 w-2/3 rounded bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}

export default function CommentsSection({ lpId }: { lpId: number | string }) {
  const { user } = useAuthUser(); // ✅ 내 계정 (id, name 등)
  const myId = user?.id;
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const qc = useQueryClient();

  // 입력창 상태
  const [input, setInput] = useState("");
  const maxLen = 300;
  const tooLong = input.length > maxLen;
  const isEmpty = input.trim().length === 0;
  const { getRaw } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const token = getRaw(); // string | null

  // 댓글 목록 (무한)
  const {
    data,
    isPending,              // 초기 로딩 → 상단 스켈레톤
    isFetchingNextPage,     // 추가 로딩 → 하단 스켈레톤
    hasNextPage,
    fetchNextPage,
  } = useInfiniteLpComments(lpId, order);

  // flat list
  const pages = (data as InfiniteData<ResponseLpCommentsDto> | undefined)?.pages ?? [];
  const comments = useMemo(() => pages.flatMap((p) => p?.data?.data ?? []), [pages]);

  // ------- 댓글 생성 --------
  const createMut = useMutation({
    mutationFn: (content: string) => createComment(Number(lpId), content, token || ""),
    onSuccess: () => {
      setInput("");
      qc.invalidateQueries({ queryKey: ["lpComments", Number(lpId)] });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || tooLong) return;
    createMut.mutate(input.trim());
  };

  // ------- (내 댓글만) 메뉴/수정/삭제 상태 --------
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-comment-menu]")) setMenuOpenId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // 수정
  const updateMut = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(Number(lpId), commentId, content, token || ""),
    onSuccess: () => {
      setEditingId(null);
      setEditText("");
      qc.invalidateQueries({ queryKey: ["lpComments", Number(lpId)] });
    },
  });

  // 삭제
  const deleteMut = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(lpId), commentId, token || ""),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", Number(lpId)] });
    },
  });

  const beginEdit = (commentId: number, currentContent: string) => {
    setEditingId(commentId);
    setEditText(currentContent);
    setMenuOpenId(null);
  };

  const confirmEdit = (commentId: number) => {
    if (!editText.trim()) return;
    updateMut.mutate({ commentId, content: editText.trim() });
  };

  const confirmDelete = (commentId: number) => {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    deleteMut.mutate(commentId);
  };

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">댓글</h2>
        <div
          role="tablist"
          aria-label="정렬"
          className="inline-flex rounded-full border border-neutral-700 overflow-hidden"
        >
          <button
            type="button"
            role="tab"
            aria-selected={order === PAGINATION_ORDER.desc}
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={
              "px-3 py-1.5 text-xs " +
              (order === PAGINATION_ORDER.desc
                ? "bg-neutral-100 text-black"
                : "bg-black text-white hover:bg-neutral-800")
            }
          >
            최신순
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={order === PAGINATION_ORDER.asc}
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={
              "px-3 py-1.5 text-xs border-l border-neutral-700 " +
              (order === PAGINATION_ORDER.asc
                ? "bg-neutral-100 text-black"
                : "bg-black text-white hover:bg-neutral-800")
            }
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 댓글 작성 */}
      <form onSubmit={onSubmit} className="mb-4 rounded-xl border border-neutral-800 p-4 bg-neutral-900">
        <label className="block text-sm text-neutral-300 mb-2">댓글 쓰기</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="내용을 입력하세요 (최대 300자)"
          className={`w-full resize-none rounded-md border px-3 py-2 bg-black text-white outline-none
            ${tooLong ? "border-red-500" : "border-neutral-700 focus:border-pink-500"}`}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className={tooLong ? "text-red-400" : "text-neutral-400"}>
            {input.length}/{maxLen}자
          </div>
          <button
            type="submit"
            disabled={isEmpty || tooLong || createMut.isPending}
            className="rounded-md bg-pink-600 px-3 py-1.5 text-xs text-white hover:bg-pink-500 disabled:bg-neutral-700 disabled:text-neutral-400"
          >
            {createMut.isPending ? "등록 중..." : "댓글 등록"}
          </button>
        </div>
        {createMut.isError && (
          <p className="mt-1 text-xs text-red-400">댓글 등록 중 오류가 발생했습니다.</p>
        )}
      </form>

      {/* 초기 로딩 스켈레톤(상단) */}
      {isPending &&
        Array.from({ length: 4 }).map((_, i) => <CommentSkeleton key={`top-skel-${i}`} />)
      }

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <ul className="divide-y divide-neutral-800">
          {comments.map((c) => {
            const isMine = myId && c.author?.id === myId;

            return (
              <li key={c.id} className="py-3 flex gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-800">
                  {c.author?.avatar && (
                    <img src={c.author.avatar} alt={c.author.name} className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{c.author?.name ?? "익명"}</div>
                      <div className="text-xs text-neutral-500">{new Date(c.createdAt).toLocaleString("ko")}</div>
                    </div>

                    {/* 내 댓글만 … 메뉴 */}
                    {isMine ? (
                      <div className="relative" data-comment-menu>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId((id) => (id === c.id ? null : c.id));
                          }}
                          className="px-2 py-1 rounded-md hover:bg-neutral-800 text-neutral-300"
                          aria-haspopup="menu"
                          aria-expanded={menuOpenId === c.id}
                          aria-label="댓글 메뉴 열기"
                        >
                          …
                        </button>

                        {menuOpenId === c.id && (
                          <div
                            role="menu"
                            className="absolute right-0 mt-1 w-32 rounded-md border border-neutral-700 bg-black text-sm shadow-lg z-10"
                          >
                            <button
                              role="menuitem"
                              className="block w-full px-3 py-2 text-left hover:bg-neutral-800"
                              onClick={() => beginEdit(c.id, c.content)}
                            >
                              수정
                            </button>
                            <button
                              role="menuitem"
                              className="block w-full px-3 py-2 text-left text-red-300 hover:bg-neutral-800"
                              onClick={() => confirmDelete(c.id)}
                              disabled={deleteMut.isPending}
                            >
                              {deleteMut.isPending ? "삭제 중..." : "삭제"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* 내용 / 수정 폼 */}
                  {editingId === c.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-md border border-neutral-700 bg-black text-white px-3 py-2 outline-none focus:border-pink-500"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => confirmEdit(c.id)}
                          disabled={updateMut.isPending || editText.trim().length === 0}
                          className="rounded-md bg-pink-600 px-3 py-1.5 text-xs text-white hover:bg-pink-500 disabled:bg-neutral-700"
                        >
                          {updateMut.isPending ? "저장 중..." : "저장"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                          className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800"
                        >
                          취소
                        </button>
                      </div>
                      {updateMut.isError && (
                        <p className="mt-1 text-xs text-red-400">수정 중 오류가 발생했습니다.</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-neutral-200 whitespace-pre-wrap">{c.content}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 추가 로딩 스켈레톤(하단) */}
      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`bottom-skel-${i}`} />)
      }

      {/* 더 보기 버튼 */}
      <div className="flex justify-center py-4">
        {hasNextPage ? (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
          >
            댓글 더 보기
          </button>
        ) : (
          <span className="text-neutral-500 text-xs">모든 댓글을 불러왔습니다.</span>
        )}
      </div>
    </section>
  );
}
