import { memo } from 'react';
import type { Movie } from '../types/movie';
import { poster } from '../lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  onCardClick: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onCardClick }: MovieCardProps) => {
  const handleClick = () => {
    onCardClick(movie);
  };

  return (
    <div
      onClick={handleClick}
      className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105 bg-gray-100"
    >
      {movie.poster_path ? (
        <img
          src={poster(movie.poster_path)}
          alt={`${movie.title} 영화의 포스터`}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
          이미지 없음
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <h3 className="text-white text-sm font-semibold line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

