import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  if (!isOpen || !movie) return null;

  const handleImdbSearch = () => {
    const searchQuery = encodeURIComponent(movie.title);
    window.open(`https://www.imdb.com/find?q=${searchQuery}`, "_blank");
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 포스터 이미지 */}
        <div className="w-full">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* 영화 정보 */}
        <div className="p-6 space-y-4">
          {/* 제목 */}
          <h2 className="text-3xl font-bold text-gray-900">{movie.title}</h2>

          {/* 평점 및 개봉일 */}
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">평점:</span>
              <span className="text-yellow-500 font-bold">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm">({movie.vote_count}명)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">개봉일:</span>
              <span>{movie.release_date}</span>
            </div>
          </div>

          {/* 줄거리 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">줄거리</h3>
            <p className="text-gray-700 leading-relaxed">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>

          {/* 원제 */}
          {movie.original_title !== movie.title && (
            <div>
              <span className="text-sm text-gray-500">
                원제: {movie.original_title}
              </span>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleImdbSearch}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              IMDb에서 검색하기
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
