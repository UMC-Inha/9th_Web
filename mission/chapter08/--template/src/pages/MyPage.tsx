import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../hooks/queries/useMe";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import SettingsModal from "../components/SettingsModal";

export default function MyPage() {
  const nav = useNavigate();
  const { data: me, isPending ,isError, refetch } = useMe();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    nav("/", { replace: true });
  };

  if (!localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)) {
    // 토큰 없으면 로그인으로 유도
    return (
      <div className="space-y-3">
        <div className="text-neutral-300">로그인이 필요합니다.</div>
        <button
          onClick={() => nav("/login")}
          className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-500"
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  if (isPending) return <div>불러오는 중...</div>;
  if (isError || !me) {
    return (
      <div className="space-y-3">
        <div>내 정보를 불러오지 못했습니다.</div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 rounded border border-neutral-700 hover:bg-neutral-800"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const avatarSrc = me.avatar ? `${me.avatar}?t=${me.updatedAt ?? Date.now()}` : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-800">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <div className="text-xl font-semibold">{me.name}</div>
          <div className="text-neutral-400">{me.email}</div>
        </div>
      </div>

      {("isPremium" in me) && (
        <div>프리미엄: {me.isPremium ? "예" : "아니오"}</div>
      )}

      <div>
        <div className="text-sm text-neutral-400 mb-1">Bio</div>
        <div className="whitespace-pre-wrap">{me.bio ?? "—"}</div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800"
        >
          설정
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
        >
          로그아웃
        </button>
      </div>

      {me && (
        <SettingsModal
          open={isSettingsModalOpen}
          onClose={() => {
            setIsSettingsModalOpen(false);
          }}
          me={me}
        />
      )}
    </div>
  );
}
