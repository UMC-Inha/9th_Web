// components/WelcomeData.tsx
import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface UserData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleTestRetry = () => {
    // 존재하지 않는 ID로 강제 에러 발생 → 재시도 테스트
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
        <button onClick={() => setIsVisible((v) => !v)}>
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button
          onClick={handleTestRetry}
          style={{ background: '#ff9800', color: 'white' }}
        >
          재시도 테스트 (404 에러)
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<UserData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) return <div>Loading... (User ID: {userId})</div>;
  if (isError) return <div>Error Occurred</div>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>User ID: {data?.id}</p>
    </div>
  );
};
