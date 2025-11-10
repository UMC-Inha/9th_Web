import { useParams } from "react-router-dom";
import { useInfiniteComments } from "../hooks/useInfiniteComments";
import { SkeletonCard } from "../components/SkeletonCard";
import { useRef, useEffect } from "react";

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteComments(Number(lpid), "latest");

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading)
    return (
      <div className="comment-list">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  return (
    <div className="comment-list">
      {data?.pages.map((page) =>
        page.items.map((c) => (
          <div key={c.id} className="comment">
            <p>
              <b>{c.author}</b> · {c.createdAt}
            </p>
            <p>{c.content}</p>
          </div>
        ))
      )}
      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={`cm${i}`} />)}
      <div ref={ref} style={{ height: "1px" }} />
    </div>
  );
};
