// src/hooks/queries/useMe.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "../../apis/axios";
import { LOCAL_STORAGE_KEY } from "../../constans/key";

export type Me = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
};

export function useMe(): UseQueryResult<Me | null, Error> {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken) ?? null;

  return useQuery<Me | null, Error>({
    queryKey: ["me", token], 
    enabled: true,           
    retry: false,            
    staleTime: 10*60*1000,
    gcTime: 10*60*1000,
    queryFn: async () => {
      if (!token) return null; // 비로그인 → 곧바로 null
      try {
        const { data } = await api.get("/v1/users/me");
        return (data?.data ?? null) as Me | null;
      } catch (err: any) {
        // 401/403은 로그인 만료로 보고 null 반환
        const status = err?.response?.status;
        if (status === 401 || status === 403) return null;
        throw err; // 그 외는 에러 표시
      }
    },
  });
}
