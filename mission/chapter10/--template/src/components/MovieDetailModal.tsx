import { memo, useEffect } from 'react';
import type { MovieDetail } from '../types/movie';
import { poster, backdrop } from '../lib/tmdb';

interface MovieDetailModalProps {
  movie: MovieDetail | null;
  onClose: () => void;
}

const MovieDetailModal = memo(({ movie, onClose }: MovieDetailModalProps) => {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImdbSearch = () => {
    const searchQuery = encodeURIComponent(movie.title);
    window.open(`https://www.imdb.com/find?q=${searchQuery}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 포스터 이미지 */}
        {movie.backdrop_path && (
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={backdrop(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* 포스터와 기본 정보 */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {movie.poster_path && (
              <div className="flex-shrink-0">
                <img
                  src={poster(movie.poster_path)}
                  alt={movie.title}
                  className="w-48 h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              {movie.original_title !== movie.title && (
                <p className="text-gray-600 mb-2">{movie.original_title}</p>
              )}
              {movie.tagline && (
                <p className="text-gray-500 italic mb-4">"{movie.tagline}"</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({movie.vote_count}명)</span>
                </div>
                {movie.release_date && (
                  <div className="text-gray-700">
                    <span className="font-semibold">개봉일:</span> {movie.release_date}
                  </div>
                )}
                {movie.runtime && (
                  <div className="text-gray-700">
                    <span className="font-semibold">상영시간:</span> {movie.runtime}분
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 줄거리 */}
          {movie.overview && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">줄거리</h3>
              <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {/* 추가 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <span className="font-semibold">제작사: </span>
                <span className="text-gray-700">
                  {movie.production_companies.map((c) => c.name).join(', ')}
                </span>
              </div>
            )}
            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
              <div>
                <span className="font-semibold">언어: </span>
                <span className="text-gray-700">
                  {movie.spoken_languages.map((l) => l.name).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <button
              onClick={handleImdbSearch}
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
            >
              IMDb에서 검색하기
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieDetailModal.displayName = 'MovieDetailModal';

export default MovieDetailModal;

