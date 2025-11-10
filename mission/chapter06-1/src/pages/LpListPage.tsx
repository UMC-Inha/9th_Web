import React from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css"; // 혹시 빠져있으면 꼭 import!

export default function LpListPage() {
  const navigate = useNavigate();

  // 가짜 데이터
  const fakeLps = [
    {
      id: 1,
      title: "Midnight Jazz Vol.1",
      date: "2025-11-05",
      likes: 42,
      thumbnail: "https://picsum.photos/400?random=1",
    },
    {
      id: 2,
      title: "City Pop Vibes",
      date: "2025-10-22",
      likes: 58,
      thumbnail: "https://picsum.photos/400?random=2",
    },
    {
      id: 3,
      title: "Chill Hop Beats",
      date: "2025-09-15",
      likes: 30,
      thumbnail: "https://picsum.photos/400?random=3",
    },
    {
      id: 4,
      title: "Vinyl Sunset",
      date: "2025-08-27",
      likes: 19,
      thumbnail: "https://picsum.photos/400?random=4",
    },
    {
      id: 5,
      title: "Soft Soul Session",
      date: "2025-07-10",
      likes: 23,
      thumbnail: "https://picsum.photos/400?random=5",
    },
  ];

  return (
    <div className="album-grid">
      {fakeLps.map((lp) => (
        <div
          key={lp.id}
          className="album-card"
          onClick={() => navigate(`/lp/${lp.id}`)}
        >
          <img src={lp.thumbnail} alt={lp.title} />
          <div className="album-info">
            <h3>{lp.title}</h3>
            <p>{lp.date}</p>
            <p>❤️ {lp.likes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
