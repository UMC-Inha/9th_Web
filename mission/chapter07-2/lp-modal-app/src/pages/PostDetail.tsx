import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function PostDetail() {
  const queryClient = useQueryClient();

  const { data: post = { id: 1, likes: 0, liked: false } } = useQuery({
    queryKey: ["post", 1],
    queryFn: async () => ({ id: 1, likes: 0, liked: false }),
  });

  const like = useMutation({
    mutationFn: async () => true,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", 1] });
      const prev = queryClient.getQueryData(["post", 1]);

      queryClient.setQueryData(["post", 1], (old: any) => ({
        ...old,
        likes: old.liked ? old.likes - 1 : old.likes + 1,
        liked: !old.liked,
      }));

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(["post", 1], ctx?.prev);
    },
  });

  return (
    <div style={{ padding: 40 }}>
      <h2>게시글 상세</h2>
      <button onClick={() => like.mutate()} style={{ padding: 10 }}>
        ❤️ {post.likes}
      </button>
    </div>
  );
}
