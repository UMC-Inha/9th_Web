import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    //부모 페이지의 공통 레이아웃
    <div className="h-dvh flex flex-col">
      <nav className="bg-pink-200 flex justify-between items-center px-4 py-3">
        <h1 className="text-pink-500 text-2xl font-bold">채채의 홈페이지</h1>

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
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
      <footer></footer>
    </div> //하위경로 /login의 내용이 이 위치에 렌더링
  );
};

export default HomeLayout;
/*
부모 라우트 컴포넌트(HomePage.tsx)는 자신의 children으로 정의된 자식 라우트 컴포넌트가 
어디에 나타나야할지 지정해줘야함. 이 역할을 하는 것이 Outlet 컴포넌트
 */
