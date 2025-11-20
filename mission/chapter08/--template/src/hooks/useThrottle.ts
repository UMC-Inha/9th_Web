import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, interval = 10000): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const latestRef = useRef<T>(value);

  useEffect(() => {
    latestRef.current = value;

    const now = Date.now();
    const remaining = interval - (now - lastRef.current);

    if (remaining <= 0) {
      // not throttled, update immediately
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastRef.current = now;
      setThrottled(value);
    } else {
      // schedule trailing update
      if (timerRef.current) {

        return;
      }
      timerRef.current = window.setTimeout(() => {
        lastRef.current = Date.now();
        setThrottled(latestRef.current);
        timerRef.current = null;
      }, remaining);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return throttled;
}
