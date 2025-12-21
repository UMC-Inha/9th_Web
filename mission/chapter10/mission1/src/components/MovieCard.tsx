import { memo, useCallback } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  const handleClick = useCallback(() => {
    onClick(movie);
  }, [movie, onClick]);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '정보 없음';

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative"
    >
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-[500px] object-cover"
        />
        {/* 평점 - 우측 상단 */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-3 py-1">
          <span className="text-sm font-bold text-gray-800">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{releaseDate}</p>
        <p className="text-sm text-gray-700 line-clamp-3">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

