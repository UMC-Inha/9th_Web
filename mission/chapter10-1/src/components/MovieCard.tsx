import React from "react";
import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
  onClick: (movie: Movie) => void;
};

function MovieCard({ movie, onClick }: Props) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "";

  return (
    <button
      onClick={() => onClick(movie)}
      className="text-left border rounded overflow-hidden"
    >
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className="w-full block" />
      ) : (
        <div className="w-full aspect-[2/3] flex items-center justify-center border-b">
          No Image
        </div>
      )}

      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
        <div className="text-sm opacity-70">
          ⭐ {movie.vote_average?.toFixed?.(1) ?? movie.vote_average} · {movie.release_date || "—"}
        </div>
      </div>
    </button>
  );
}

export default React.memo(MovieCard);
