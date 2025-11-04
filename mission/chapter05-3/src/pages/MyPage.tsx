import React from 'react';
import { useAuth } from '../context/useAuth';

const MyPage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>마이페이지 👤</h1>
      <p>프리미엄 회원 전용 페이지입니다.</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
};

export default MyPage;
