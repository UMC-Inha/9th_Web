import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import PostDetail from "./pages/PostDetail";
import { useUser } from "./store/userState";

export default function App() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div style={{ color: "#fff" }}>로딩중...</div>;

  const isLoggedIn = !!user;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      {isLoggedIn && <NavBar />}

      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/login" />} />
        <Route path="/post/:id" element={isLoggedIn ? <PostDetail /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
