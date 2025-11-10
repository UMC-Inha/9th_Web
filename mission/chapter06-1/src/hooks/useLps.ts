// src/hooks/useLps.ts
import { useQuery } from "@tanstack/react-query";

// ✅ 반드시 export 붙여야 함
export interface LpItem {
  id: number;
  title: string;
  uploadDate: string;
  likes: number;
  thumbnailUrl: string;
}

export function useLps(sort: "latest" | "oldest") {
  return useQuery({
    queryKey: ["lps", sort],
    queryFn: async (): Promise<LpItem[]> => {
      // 임시 지연
      await new Promise((resolve) => setTimeout(resolve, 800));

      // ✅ 더미 데이터
      const dummyData: LpItem[] = [
        {
          id: 1,
          title: "Midnight Jazz Vol.1",
          uploadDate: "2025-11-05",
          likes: 42,
          thumbnailUrl: "https://picsum.photos/400?random=1",
        },
        {
          id: 2,
          title: "City Pop Vibes",
          uploadDate: "2025-10-22",
          likes: 58,
          thumbnailUrl: "https://picsum.photos/400?random=2",
        },
        {
          id: 3,
          title: "Chill Hop Beats",
          uploadDate: "2025-09-15",
          likes: 30,
          thumbnailUrl: "https://picsum.photos/400?random=3",
        },
      ];

      // 정렬
      return [...dummyData].sort((a, b) => {
        if (sort === "latest")
          return (
            new Date(b.uploadDate).getTime() -
            new Date(a.uploadDate).getTime()
          );
        else
          return (
            new Date(a.uploadDate).getTime() -
            new Date(b.uploadDate).getTime()
          );
      });
    },
    staleTime: 1000 * 60,
  });
}
