export function LoadingSpinner() {
  return <div style={{ textAlign: "center", padding: "2rem" }}>⏳ 로딩 중...</div>;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      ⚠️ 오류 발생!{" "}
      <button onClick={onRetry} style={{ marginLeft: "8px" }}>
        재시도
      </button>
    </div>
  );
}
