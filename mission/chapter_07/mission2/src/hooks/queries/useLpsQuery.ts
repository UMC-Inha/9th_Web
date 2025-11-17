import { useQuery } from "@tanstack/react-query";
import {
  fetchLps,
  type FetchLpsResponse,
  type LpItem,
} from "../../apis/lps.js";

export function useLpsQuery(order: "asc" | "desc") {
  return useQuery<FetchLpsResponse, Error, LpItem[]>({
    queryKey: ["lps", order],
    queryFn: () => fetchLps(order),
    staleTime: 30_000,
    select: (raw) => raw.data.data,
  });
}
