import { useState, useCallback, useMemo } from 'react';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';
import { searchMovies } from './api/movieApi';
import type { Movie, Language } from './types/movie';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback(
    async (query: string, includeAdult: boolean, language: Language) => {
      setLoading(true);
      try {
        const response = await searchMovies(query, includeAdult, language);
        setMovies(response.results);
      } catch (error) {
        console.error('검색 오류:', error);
        alert(error instanceof Error ? error.message : '영화 검색 중 오류가 발생했습니다.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const memoizedMovies = useMemo(() => movies, [movies]);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} />
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : (
          <MovieList movies={memoizedMovies} onMovieClick={handleMovieClick} />
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default App;

