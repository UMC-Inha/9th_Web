import { useQuery } from "@tanstack/react-query";
import { fetchLpDetail } from "../../apis/lps.js";

export function useLpDetailQuery(lpId: number) {
  return useQuery({
    queryKey: ["lp", lpId],
    queryFn: () => fetchLpDetail(lpId),
    enabled: !!lpId,
    staleTime: 30_000,
  });
}
