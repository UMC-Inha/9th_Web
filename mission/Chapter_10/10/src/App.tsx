import { useState } from 'react'
import MovieSearchForm from './components/MovieSearch/MovieSearchForm'
import MovieDetailModal from './components/MovieSearch/MovieDetailModal'
import { searchMovies } from './services/tmdbApi'
import type { MovieSearchResponse, Movie } from './services/tmdbApi'
import './App.css'

function App() {
  const [searchResults, setSearchResults] = useState<MovieSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = async (data: {
    movieTitle: string
    includeAdult: boolean
    language: string
  }) => {
    if (!data.movieTitle.trim()) {
      setError('영화 제목을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchMovies({
        query: data.movieTitle,
        include_adult: data.includeAdult,
        language: data.language,
      })
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : '영화 검색 중 오류가 발생했습니다.')
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  return (
    <div className="app">
      <MovieSearchForm onSubmit={handleSearch} />
      
      {isLoading && <div className="loading">검색 중...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {searchResults && (
        <div className="search-results">
          <h2>검색 결과 ({searchResults.total_results}개)</h2>
          <div className="movies-grid">
            {searchResults.results.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie)}
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                )}
                <h3>{movie.title}</h3>
                <p className="release-date">{movie.release_date}</p>
                <p className="rating">평점: {movie.vote_average.toFixed(1)}</p>
                <p className="overview">{movie.overview}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default App
