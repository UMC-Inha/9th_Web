import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';
import { QUERY_KEY } from '../constants/key';

export function useGetMyInfo(accessToken: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터 신선 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 정리
  });
}
