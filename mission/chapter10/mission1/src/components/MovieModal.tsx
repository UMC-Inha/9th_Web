import { memo, useCallback } from 'react';
import type { Movie } from '../types/movie';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = memo(({ movie, onClose }: MovieModalProps) => {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleImdbSearch = useCallback(() => {
    if (movie) {
      const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
      window.open(imdbUrl, '_blank');
    }
  }, [movie]);

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : posterUrl;

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '정보 없음';

  // 인기도를 0-100 범위로 정규화 (vote_average를 기반으로)
  const popularityPercent = Math.min((movie.vote_average / 10) * 100, 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 상단 배경 이미지와 제목 */}
        <div className="relative h-64">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">{movie.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="p-6">
          <div className="flex gap-6">
            {/* 좌측 포스터 */}
            <div className="flex-shrink-0">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-48 h-[720px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* 우측 정보 */}
            <div className="flex-1 space-y-4">
              {/* 평점 */}
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {movie.vote_average.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">
                  ({movie.vote_count} 평가)
                </div>
              </div>

              {/* 개봉일 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  개봉일
                </div>
                <div className="text-gray-800">{releaseDate}</div>
              </div>

              {/* 인기도 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  인기도
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${popularityPercent}%` }}
                  />
                </div>
              </div>

              {/* 줄거리 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  줄거리
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {movie.overview || '줄거리 정보가 없습니다.'}
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleImdbSearch}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  IMDb에서 검색
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieModal.displayName = 'MovieModal';

export default MovieModal;

