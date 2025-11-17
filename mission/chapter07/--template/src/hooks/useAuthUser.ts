import { useEffect, useState, useCallback } from "react";
import { getMyInfo } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import type { ResponseMyInfoDto } from "../types/auth";

export function useAuthUser() {
  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMyInfo()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUser();

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY.accessToken) {
        fetchUser();
      }
    };

    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 변경 감지)
    const handleTokenChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    setUser(null);
  };

  return { user, loading, logout, refresh: fetchUser };
}
