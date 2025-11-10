import { useNavigate } from "react-router-dom";
import type { LpItem } from "../hooks/useLps";

interface LPCardProps {
  lp: LpItem;
}

export default function LPCard({ lp }: LPCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="album-card"
      onClick={() => navigate(`/lp/${lp.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={lp.thumbnailUrl} alt={lp.title} />
      <div className="album-overlay">
        <h3>{lp.title}</h3>
        <p>{lp.uploadDate}</p>
        <span>❤️ {lp.likes}</span>
      </div>
    </div>
  );
}
