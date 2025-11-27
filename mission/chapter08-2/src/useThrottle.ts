import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, interval: number = 200): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecuted.current;

    if (elapsed >= interval) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const remaining = interval - elapsed;
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, interval]);

  return throttledValue;
}
