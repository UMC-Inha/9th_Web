const HomePage: React.FC = () => {
  const isLoggedIn = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃되었습니다.');
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏠 홈 페이지</h1>
      {isLoggedIn ? (
        <>
          <p>프리미엄 웹툰 보러가기</p>
          <a href="/premium/webtoon/1">/premium/webtoon/1</a>
          <br />
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <p>로그인이 필요합니다.</p>
          <a href="/login">로그인 페이지로 이동</a>
        </>
      )}
    </div>
  );
};

export default HomePage; // ✅ 반드시 default export
