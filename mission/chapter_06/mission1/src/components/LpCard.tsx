import { useNavigate } from "react-router-dom";
import type { LpItem } from "../apis/lps";

export default function LpCard({ item }: { item: LpItem }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lps/${item.id}`)}
      className="relative cursor-pointer group overflow-hidden rounded-lg border border-gray-200"
    >
      <img
        src={item.thumbnail ?? "/no-image.png"}
        alt={item.title}
        className="w-full aspect-video object-cover transition-transform duration-200 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="font-semibold">{item.title}</div>

        <div className="text-xs mt-1 flex items-center gap-2">
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          <span>· ❤️ {item.likes.length}</span>
        </div>
      </div>
    </div>
  );
}
