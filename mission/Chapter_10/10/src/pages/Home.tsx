import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieSearchForm from '../components/MovieSearch/MovieSearchForm'
import MovieDetailModal from '../components/MovieSearch/MovieDetailModal'
import MovieCard from '../components/MovieSearch/MovieCard'
import { searchMovies } from '../services/tmdbApi'
import type { MovieSearchResponse, Movie } from '../services/tmdbApi'
import '../App.css'

function Home() {
  console.log('Home 컴포넌트 렌더링')
  
  const [searchResults, setSearchResults] = useState<MovieSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = useCallback(async (data: {
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
  }, [])

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
    // 라우팅 테스트를 위해 URL도 변경
    navigate(`/movies/${movie.id}`)
  }, [navigate])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedMovie(null)
    navigate('/')
  }, [navigate])

  // 검색 결과 메모이제이션
  const moviesList = useMemo(() => {
    console.log('영화 리스트 계산 중...')
    return searchResults?.results || []
  }, [searchResults?.results])

  // 검색 결과 개수 메모이제이션
  const totalResults = useMemo(() => {
    return searchResults?.total_results || 0
  }, [searchResults?.total_results])

  return (
    <div className="app">
      <MovieSearchForm onSubmit={handleSearch} />
      
      {isLoading && <div className="loading">검색 중...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {searchResults && (
        <div className="search-results">
          <h2>검색 결과 ({totalResults}개)</h2>
          <div className="movies-grid">
            {moviesList.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleMovieClick}
              />
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

export default Home

