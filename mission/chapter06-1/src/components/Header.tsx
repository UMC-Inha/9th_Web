import React from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  user: { nickname: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ nickname: string } | null>>;
}

export default function Header({ toggleSidebar, user, setUser }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="burger-btn" onClick={toggleSidebar}>
          <svg
            width="28"
            height="28"
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
        <h1 className="logo-text">돌려돌려LP판</h1>
      </div>

      <div className="header-right">
        <input
          className="search-input"
          placeholder="앨범, 아티스트 검색..."
        />
        {user ? (
          <>
            <span className="welcome">{user.nickname}님 반갑습니다.</span>
            <button
  onClick={() => {
    localStorage.removeItem("user");
    setUser(null);
    alert("로그아웃되었습니다.");
  }}
>
  로그아웃
</button>

          </>
        ) : (
          <>
            <button
              className="login-btn"
              onClick={() => setUser({ nickname: "오타나인" })}
            >
              로그인
            </button>
            <button className="signup-btn">회원가입</button>
          </>
        )}
      </div>
    </header>
  );
}
