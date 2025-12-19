import React, { useEffect } from "react";
import type { Movie } from "../types/movie";

type Props = {
  movie: Movie;
  onClose: () => void;
};

function MovieModal({ movie, onClose }: Props) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-white rounded overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="w-full block" />
        ) : (
          <div className="w-full aspect-[2/3] flex items-center justify-center border-b">
            No Image
          </div>
        )}

        <div className="p-4 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <div className="text-sm opacity-70">
              ⭐ {movie.vote_average?.toFixed?.(1) ?? movie.vote_average} · 개봉일: {movie.release_date || "—"}
            </div>
          </div>

          <p className="text-sm leading-6 whitespace-pre-line">
            {movie.overview || "줄거리 정보가 없습니다."}
          </p>

          <div className="flex gap-2 justify-end">
            <a
              href={imdbUrl}
              target="_blank"
              rel="noreferrer"
              className="border rounded px-3 py-2"
            >
              IMDb에서 검색하기
            </a>
            <button onClick={onClose} className="border rounded px-3 py-2">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MovieModal);
