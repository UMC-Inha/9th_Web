import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import ErrorState from "../components/ErrorState";
import { useAuthUser } from "../hooks/useAuthUser";
import { useMe } from "../hooks/queries/useMe";
import { useEffect, useMemo, useState } from "react";
import CommentsSection from "../components/CommentsSection";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import { useLikeLp } from "../hooks/mutations/useLikeLp";
import ConfirmModal from "../components/ConfirmModal";
import EditLpModal from "../components/EditLpModal";

const fmt = (s?: string) =>
  s ? new Intl.DateTimeFormat("ko", { dateStyle: "medium" }).format(new Date(s)) : "";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const nav = useNavigate();
  const location = useLocation();
  const { data, isPending, isError, refetch } = useGetLpDetail(lpid);
  const { user, loading: userLoading } = useAuthUser();
  const { mutate: deleteLp, isPending: isDeleting } = useDeleteLp();
  const { mutate: toggleLike, isPending: isLiking } = useLikeLp(lpid ? Number(lpid) : 0);

  // 비로그인 경고 모달
  const [showAuthModal, setShowAuthModal] = useState(false);
  // 삭제 확인 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // 수정 모달
  const [showEditModal, setShowEditModal] = useState(false);

  // 현재 사용자가 좋아요를 눌렀는지 확인 (hooks는 항상 같은 순서로 호출되어야 함)
  // useMe를 사용하여 일관성 유지
  const { data: me } = useMe();
  const isLiked = useMemo(() => {
    if (!me || !data?.data?.likes) return false;
    return data.data.likes.some((like) => like.userId === me.id);
  }, [me, data?.data?.likes]);

  // ✔ side-effect 용으로 useEffect 사용 (useMemo 아님)
  useEffect(() => {
    if (!userLoading && !user) {
      setShowAuthModal(true);
    }
  }, [userLoading, user]);

  // 모달 "확인" → /login (로그인 후 복귀를 위한 state.from 포함)
  const goLoginWithReturn = () => {
    nav("/login", { state: { from: location } });
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl py-10 space-y-4">
        <div className="h-6 w-48 rounded bg-neutral-800 animate-pulse" />
        <div className="aspect-video w-full rounded-xl bg-neutral-800 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-neutral-800 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-neutral-800 animate-pulse" />
      </div>
    );
    }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <ErrorState message="상세 정보를 불러오지 못했습니다." onRetry={() => refetch()} />
      </div>
    );
  }

  const lp = data.data;

  const likeCount = lp.likes?.length ?? 0;

  // 액션 핸들러
  const onEdit = () => setShowEditModal(true);
  const onDelete = () => setShowDeleteModal(true);
  const onToggleLike = () => {
    if (!me) {
      setShowAuthModal(true);
      return;
    }
    if (isLiking) return;
    
    toggleLike(isLiked, {
      onError: (err: any) => {
        if (err?.response?.status !== 409) {
          alert(err instanceof Error ? err.message : "좋아요 처리 중 오류가 발생했습니다.");
        }
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteLp(lp.id, {
      onSuccess: () => {
        nav("/", { replace: true });
      },
      onError: (err) => {
        alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
        setShowDeleteModal(false);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl relative">
      {/* 경고 모달 */}
      {showAuthModal && (
        <AuthRequireModal
          onConfirm={goLoginWithReturn}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={showDeleteModal}
        title="LP 삭제"
        message="정말 이 LP를 삭제하시겠습니까? 삭제된 LP는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* 수정 모달 */}
      {showEditModal && lp && (
        <EditLpModal lp={lp} onClose={() => setShowEditModal(false)} />
      )}

      {/* 상단 헤더 + 액션 바 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-neutral-700">
            {lp.author?.avatar && (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">{lp.author?.name ?? "작성자"}</div>
            <div className="text-xs text-neutral-400">{fmt(lp.createdAt)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLike}
            disabled={isLiking}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm
              ${
                isLiked
                  ? "border-pink-500/40 bg-pink-500/15 text-pink-300"
                  : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-pressed={isLiked}
            title="좋아요"
          >
            <span aria-hidden>♥</span>
            <span>{likeCount}</span>
          </button>
          {user && user.id === lp.authorId && (
            <>
              <button
                onClick={onEdit}
                className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
                title="수정"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-md border border-red-600/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title="삭제"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 제목 */}
      <h1 className="mb-3 text-2xl font-bold">{lp.title}</h1>

      {/* 썸네일 */}
      <div className="mb-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <img src={lp.thumbnail} alt={lp.title} className="h-auto w-full object-cover" />
      </div>

      {/* 본문 */}
      <p className="mb-6 whitespace-pre-wrap leading-7 text-neutral-200">{lp.content}</p>

      {/* 태그 */}
      {lp.tags?.length ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {lp.tags.map((t) => (
            <span key={t.id} className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-200">
              #{t.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* 목록으로 */}
      <div className="mt-8">
        <Link to="/" className="text-sm text-pink-400 hover:underline">
          목록으로
        </Link>
      </div>

      {/* ✔ 댓글 섹션 (무한스크롤 + 스켈레톤 + 입력 UI) */}
      <CommentsSection lpId={lp.id} />
    </div>
  );
}

/** 비로그인 경고 모달 */
function AuthRequireModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl border border-neutral-700 bg-neutral-900 p-6 text-white shadow-xl">
          <h3 className="mb-2 text-lg font-semibold">로그인이 필요합니다</h3>
          <p className="mb-4 text-sm text-neutral-300">
            이 페이지는 로그인 후 이용할 수 있어요. 로그인 페이지로 이동할까요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 py-2 hover:bg-neutral-800"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-md bg-pink-600 py-2 hover:bg-pink-500"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
