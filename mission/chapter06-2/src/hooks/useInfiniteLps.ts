import { useInfiniteQuery } from "@tanstack/react-query";

interface LpItem {
  id: number;
  title: string;
  thumbnail: string;
  likes: number;
  createdAt: string;
}

export const useInfiniteLps = (sort: "latest" | "oldest" = "latest") => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: async ({ pageParam = 1 }) => {
      await new Promise((r) => setTimeout(r, 500));

      const items: LpItem[] = Array.from({ length: 6 }).map((_, i) => ({
        id: (pageParam - 1) * 6 + i + 1,
        title: `LP 앨범 ${i + 1 + (pageParam - 1) * 6}`,
        thumbnail: `https://picsum.photos/300?random=${i + pageParam * 10}`,
        likes: Math.floor(Math.random() * 100),
        createdAt: `2025-11-${Math.floor(Math.random() * 10 + 1)}`,
      }));

      const sorted =
        sort === "latest"
          ? items.sort((a, b) => b.id - a.id)
          : items.sort((a, b) => a.id - b.id);

      return { items: sorted, nextPage: pageParam + 1, hasMore: pageParam < 5 };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};
