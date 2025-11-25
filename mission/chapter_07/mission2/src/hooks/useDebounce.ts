import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // ⭐ 언마운트 시 타이머 정리 (필수)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // ⭐ delay 변경 시도 즉시 반영

  return debounced;
}
