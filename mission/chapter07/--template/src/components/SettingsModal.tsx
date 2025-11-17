import { useEffect, useMemo, useRef, useState } from "react";
import useUpdateMe from "../hooks/useUpdateMe";
import type { Me } from "../hooks/queries/useMe";

export default function SettingsModal({
  open,
  onClose,
  me,
}: {
  open: boolean;
  onClose: () => void;
  me: Me;
}) {
  const [name, setName] = useState(me?.name ?? "");
  const [bio, setBio] = useState<string>(me?.bio ?? "");
  const [file, setFile] = useState<File | null>(null);

  // 모달 열릴 때 현재 값으로 초기화
  useEffect(() => {
    if (open) {
      setName(me?.name ?? "");
      setBio(me?.bio ?? "");
      setFile(null);
    }
  }, [open, me]);

  const preview = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return me?.avatar ?? "";
  }, [file, me]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useUpdateMe();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름은 필수입니다.");
      return;
    }
    mutate(
      {
        name: name.trim(),
        bio: bio?.trim() ?? "",
        avatar: file ?? null, // 옵션
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message ?? "수정 중 오류가 발생했습니다.");
        },
      }
    );
  };

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {/* 배경 클릭 시 닫힘 */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-5 text-white shadow-xl"
          onClick={stop}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">프로필 설정</h2>
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-800"
              aria-label="닫기"
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* 아바타 미리보기 */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-neutral-800">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-x-2">
                <button
                  type="button"
                  className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm hover:bg-neutral-800"
                  onClick={() => inputRef.current?.click()}
                >
                  사진 선택
                </button>
                {file && (
                  <button
                    type="button"
                    className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm hover:bg-neutral-800"
                    onClick={() => setFile(null)}
                  >
                    제거
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                />
              </div>
            </div>

            {/* 이름(필수) */}
            <div>
              <label className="mb-1 block text-sm text-neutral-300">이름 *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-black px-3 py-2 outline-none focus:border-pink-500"
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* Bio(옵션) */}
            <div>
              <label className="mb-1 block text-sm text-neutral-300">Bio </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-neutral-700 bg-black px-3 py-2 outline-none focus:border-pink-500"
                placeholder="간단한 소개를 적어주세요"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-pink-600 px-3 py-2 text-sm text-white hover:bg-pink-500 disabled:bg-neutral-700"
              >
                {isPending ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>

         
        </div>
      </div>
    </>
  );
}
