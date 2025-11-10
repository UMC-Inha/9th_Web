import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner, ErrorState } from "../components/LoadingSpinner";
import type { LpItem } from "../hooks/useLps"; // ✅ 타입으로만 import

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: async (): Promise<LpItem> => {
      await new Promise((r) => setTimeout(r, 500));

      const dummyData: LpItem[] = [
        {
          id: 1,
          title: "Midnight Jazz Vol.1",
          uploadDate: "2025-11-05",
          likes: 42,
          thumbnailUrl: "https://picsum.photos/400?random=1",
        },
      ];

      return dummyData.find((d) => d.id.toString() === lpid) ?? dummyData[0];
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState refetch={refetch} />;

  const lp = data!;
  return (
    <div className="lp-detail">
      <h2>{lp.title}</h2>
      <p>{lp.uploadDate}</p>
      <p>❤️ {lp.likes}</p>
      <img src={lp.thumbnailUrl} alt={lp.title} />
    </div>
  );
}
