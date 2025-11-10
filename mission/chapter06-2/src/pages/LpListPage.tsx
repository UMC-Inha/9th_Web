import { useRef, useEffect, useState } from "react";
import { useInfiniteLps } from "../hooks/useInfiniteLps";
import { SkeletonCard } from "../components/SkeletonCard";
import { SortToggle } from "../components/SortToggle";
import { Link } from "react-router-dom";

export const LpListPage = () => {
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteLps(sort);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div>
      <SortToggle
        sort={sort}
        onToggle={() => setSort(sort === "latest" ? "oldest" : "latest")}
      />

      {isLoading ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid">
          {data?.pages.map((page) =>
            page.items.map((lp) => (
              <Link key={lp.id} to={`/lp/${lp.id}`} className="lp-card">
                <img src={lp.thumbnail} alt={lp.title} />
                <p>{lp.title}</p>
                <small>{lp.createdAt}</small>
                <span>❤️ {lp.likes}</span>
              </Link>
            ))
          )}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          <div ref={observerRef} style={{ height: "1px" }} />
        </div>
      )}
    </div>
  );
};
