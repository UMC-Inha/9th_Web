import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb } from '../lib/tmdb';
import type { MovieDetail } from '../types/movie';

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!movieId) {
        setError('영화 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await tmdb.get<MovieDetail>(`/movie/${movieId}`, {
          params: {
            language: 'ko-KR',
          },
        });
        setMovie(response.data);
      } catch (err) {
        setError('영화 상세 정보를 불러오는데 실패했습니다.');
        console.error('Movie detail error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '영화를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          ← 뒤로가기
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-600 mb-4">영화 ID: {movieId}</p>
          <p className="text-gray-700">{movie.overview || '줄거리가 없습니다.'}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;

