import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';

export function useGetMyInfo() {
  return useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터 신선 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 정리
  });
}
