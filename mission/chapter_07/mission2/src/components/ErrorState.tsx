// src/components/ErrorState.tsx
export default function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-4 text-red-600">
      오류가 발생했어요.{" "}
      <button
        onClick={onRetry}
        className="ml-2 px-3 py-1 rounded bg-pink-600 text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
