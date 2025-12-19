import React from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
  onClickMovie: (movie: Movie) => void;
};

function MovieGrid({ movies, onClickMovie }: Props) {
  return (
    <section className="w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} onClick={onClickMovie} />
        ))}
      </div>
    </section>
  );
}

export default React.memo(MovieGrid);
