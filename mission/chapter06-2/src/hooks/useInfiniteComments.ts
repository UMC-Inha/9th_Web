import { useInfiniteQuery } from "@tanstack/react-query";

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export const useInfiniteComments = (lpid: number, order: "latest" | "oldest") => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpid, order],
    queryFn: async ({ pageParam = 1 }) => {
      await new Promise((r) => setTimeout(r, 400));
      const fakeComments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
        id: (pageParam - 1) * 5 + i + 1,
        author: `사용자${i + 1}`,
        content: `💬 이건 ${i + 1}번째 댓글입니다.`,
        createdAt: `2025-11-${Math.floor(Math.random() * 10 + 1)}`,
      }));
      return {
        items: fakeComments,
        nextPage: pageParam + 1,
        hasMore: pageParam < 4,
      };
    },
    getNextPageParam: (last) => (last.hasMore ? last.nextPage : undefined),
  });
};
