import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const HomeLayout = () => {
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 shadow flex-shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <Link
            to="/"
            className="px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            돌아가는 인생
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 font-semibold"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="hidden md:block px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 font-semibold"
              >
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <>
              <span className="font-semibold px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 cursor-pointer">
                {user?.name}님 어서오세용
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 font-semibold cursor-pointer"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`
            flex flex-col justify-between w-60 p-6 
            bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200
            transition-transform duration-300
            md:relative md:translate-x-0
            fixed h-full z-50
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div>
            <nav className="flex flex-col space-y-5 mt-7 ml-3 font-semibold">
              <Link
                to={"/"}
                className="hover:text-white transition-all duration-200"
              >
                찾기
              </Link>
              <Link
                to={"/my"}
                className="hover:text-white transition-all duration-200"
              >
                마이페이지
              </Link>
            </nav>
          </div>
          <Link to={"/"} className="ml-13">
            탈퇴하기
          </Link>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="fixed bottom-8 right-8 z-30">
        <button className="bg-blue-700 hover:bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer">
          <span className="text-4xl font-light pb-1">+</span>
        </button>
      </div>
    </div>
  );
};

export default HomeLayout;
