import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const HomePage: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>홈페이지</h1>
      {isLoggedIn ? (
        <>
          <p>로그인 상태입니다 ✅</p>
          <Link to="/mypage">마이페이지로 이동</Link>
          <br />
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <Link to="/login">로그인 페이지로 이동</Link>
      )}
    </div>
  );
};

export default HomePage;
