import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieModal from "./MovieModal";

interface MovieListProps {
  movies: Movie[];
}

const MovieList = ({ movies }: MovieListProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Poster";

          return (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  <span>{movie.release_date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MovieList;
