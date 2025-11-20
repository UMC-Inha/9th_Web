import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteUserMutation } from "../hooks/queries/useDeleteUserMutation.js";

export type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export default function Sidebar({ onNavigate, className = "" }: SidebarProps) {
  const item =
    "block w-full text-left px-4 py-2 rounded hover:bg-pink-50 text-pink-700 transition-colors";

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { mutate: deleteUser, isPending } = useDeleteUserMutation();

  return (
    <>
      <nav className={`p-3 space-y-1 ${className}`}>
        <Link to="/" className={item} onClick={onNavigate}>
          🏠 홈
        </Link>

        <Link to="/my" className={item} onClick={onNavigate}>
          👤 마이페이지
        </Link>

        <div className="h-px bg-gray-200 my-2" />

        <Link to="/lps" className={item} onClick={onNavigate}>
          📄 LP 리스트
        </Link>

        <button
          type="button"
          className={`${item} text-red-500`}
          onClick={() => setOpenDeleteModal(true)}
        >
          🗑 탈퇴하기
        </button>
      </nav>

      {openDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md space-y-4 w-[260px] text-center">
            <p className="text-gray-800 font-medium">
              정말 탈퇴하시겠습니까? 🥲
            </p>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 py-2 rounded bg-gray-300"
                onClick={() => setOpenDeleteModal(false)}
              >
                취소
              </button>

              <button
                className="flex-1 py-2 rounded bg-red-500 text-white disabled:bg-red-300"
                disabled={isPending}
                onClick={() => deleteUser()}
              >
                {isPending ? "처리 중…" : "예, 탈퇴할래요"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
