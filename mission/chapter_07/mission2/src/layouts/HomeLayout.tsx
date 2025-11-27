import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import Sidebar from "../components/Sidebar.js";
import burgerIcon from "../assets/svg.png";
import { useLogoutMutation } from "../hooks/queries/useLogoutMutation.js";
import { useSidebar } from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isAuthed, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, open, close, toggle } = useSidebar(false);

  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  return (
    <div className="h-dvh flex flex-col">
      <nav className="bg-pink-200 flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="md:hidden">
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

      <div className="flex flex-1 relative">
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

      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={close} />
        <div
          ref={sheetRef}
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-xl p-4 transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={close} />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
