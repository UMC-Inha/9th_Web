// src/layouts/HomeLayout.tsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import Sidebar from "../components/Sidebar.js";
import burgerIcon from "../assets/svg.png";
import { useLogoutMutation } from "../hooks/queries/useLogoutMutation"; // ⭐ 추가

const HomeLayout = () => {
  const { isAuthed, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const logoutMutation = useLogoutMutation(); // ⭐ useMutation 호출

  const handleLogout = async () => {
    await logoutMutation.mutateAsync(); // ⭐ 로그아웃 요청
  };

  // 라우트 변경 시 모달형 사이드바 자동 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 바깥 클릭/ESC 로 닫기
  useEffect(() => {
    /* 생략 (기존 코드 유지) */
  }, [isOpen]);

  return (
    <div className="h-dvh flex flex-col">
      {/* Header */}
      <nav className="bg-pink-200 flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <img src={burgerIcon} alt="메뉴" className="w-7 h-7" />
          </button>
          <h1
            className="text-pink-500 text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            채채의 홈페이지
          </h1>
        </div>

        {!isAuthed ? (
          /* 로그인 안 했을 때 */
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              회원가입
            </Link>
          </div>
        ) : (
          /* 로그인 했을 때 */
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base">
              <b>{user?.name}</b>님 반갑습니다.
            </span>
            <Link
              to="/my"
              className="px-3 py-2 bg-white text-pink-600 rounded-md hover:bg-pink-50 border border-pink-300"
            >
              내 정보
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              로그아웃
            </button>
          </div>
        )}
      </nav>

      {/* Body */}
      {/* ... 나머지는 기존 코드 그대로 유지 ... */}
      <div className="flex flex-1 relative">
        {/* 데스크탑 사이드바 */}
        <aside
          id="app-sidebar"
          className="hidden md:block w-60 shrink-0 border-r border-gray-200"
        >
          <Sidebar />
        </aside>

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
