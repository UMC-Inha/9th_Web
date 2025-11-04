import React from 'react';
import { useParams } from 'react-router-dom';

const PremiumWebtoon: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌟 프리미엄 웹툰 #{id}</h1>
      <p>이 페이지는 프리미엄 회원만 접근할 수 있습니다.</p>
    </div>
  );
};

export default PremiumWebtoon;
