import { useState, useCallback, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdb } from '../lib/tmdb';
import type { Movie, MovieResponse } from '../types/movie';
import MovieSearchForm from '../components/MovieSearchForm';
import MovieCard from '../components/MovieCard';

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('영화 제목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await tmdb.get<MovieResponse>('/search/movie', {
        params: {
          query: searchQuery,
          include_adult: includeAdult,
          language: language,
          page: 1,
        },
      });

      setMovies(response.data.results);
    } catch (err) {
      setError('영화 검색에 실패했습니다. 다시 시도해주세요.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, includeAdult, language]);

  const handleCardClick = useCallback((movie: Movie) => {
    navigate(`/movies/${movie.id}`);
  }, [navigate]);

  const handleSearchQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleIncludeAdultChange = useCallback((value: boolean) => {
    setIncludeAdult(value);
  }, []);

  const handleLanguageChange = useCallback((value: string) => {
    setLanguage(value);
  }, []);

  const movieCards = useMemo(() => {
    return movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} onCardClick={handleCardClick} />
    ));
  }, [movies, handleCardClick]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          영화 검색
        </h1>

        {/* 검색 폼 */}
        <div className="mb-8">
          <MovieSearchForm
            searchQuery={searchQuery}
            includeAdult={includeAdult}
            language={language}
            onSearchQueryChange={handleSearchQueryChange}
            onIncludeAdultChange={handleIncludeAdultChange}
            onLanguageChange={handleLanguageChange}
            onSearch={handleSearch}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* 영화 목록 */}
        {!isLoading && movies.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              검색 결과 ({movies.length}개)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movieCards}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {!isLoading && movies.length === 0 && searchQuery && !error && (
          <div className="text-center py-12 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 초기 상태 */}
        {!isLoading && movies.length === 0 && !searchQuery && (
          <div className="text-center py-12 text-gray-500">
            영화 제목을 입력하고 검색해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

