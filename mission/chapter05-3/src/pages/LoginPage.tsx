import React from 'react';
import { useAuth } from '../context/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // 토큰은 실제 서버에서 받아오는 값이어야 함
    login('fake_access_token_123', 'fake_refresh_token_456');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>로그인 페이지</h1>
      <button onClick={handleLogin}>로그인 하기</button>
    </div>
  );
};

export default LoginPage;
