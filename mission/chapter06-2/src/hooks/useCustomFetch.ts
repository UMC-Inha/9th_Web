// hooks/useCustomFetch.ts
import { useEffect, useMemo, useRef, useState } from 'react';

// ✅ 캐싱 지속 시간 설정 (5분)
const STALE_TIME = 5 * 60 * 1_000;

// ✅ 최대 재시도 횟수 & 지수 백오프 딜레이
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// ✅ 캐시 데이터 구조 정의
interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const storageKey = useMemo(() => url, [url]);

  // 요청 취소를 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    setIsError(false);

    const fetchData = async (currentRetry = 0) => {
      const now = Date.now();
      const cachedItem = localStorage.getItem(storageKey);

      // 1️⃣ 캐시 확인
      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          // 신선한 데이터(staleTime 이내)
          if (now - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log(`[Cache Hit] Using fresh data for ${url}`);
            return;
          }

          // 오래된 캐시: 먼저 보여주고 백그라운드 refetch
          setData(cachedData.data);
          console.log(`[Cache Stale] Refetching ${url}`);
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      // 2️⃣ 네트워크 요청
      setIsPending(true);

      try {
        const res = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const newData: T = await res.json();

        // 3️⃣ 상태 및 캐시 갱신
        setData(newData);
        const newCache: CacheEntry<T> = {
          data: newData,
          lastFetched: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(newCache));
        setIsPending(false);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log(`[Fetch Cancelled] ${url}`);
          return;
        }

        // 재시도 로직
        if (currentRetry < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log(`[Retry ${currentRetry + 1}/${MAX_RETRIES}] in ${delay}ms`);
          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, delay);
        } else {
          setIsError(true);
          setIsPending(false);
          console.error(`[Fetch Failed] after ${MAX_RETRIES} retries`, err);
        }
      }
    };

    fetchData();

    // cleanup: 컴포넌트 언마운트 시 fetch 중단 & 타이머 정리
    return () => {
      abortControllerRef.current?.abort();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};
