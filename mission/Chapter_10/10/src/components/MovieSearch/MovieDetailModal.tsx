import type { Movie } from '../../services/tmdbApi'
import './MovieDetailModal.css'

interface MovieDetailModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
}

function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  if (!isOpen || !movie) return null

  const handleImdbSearch = () => {
    const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`
    window.open(imdbUrl, '_blank')
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="닫기">
          ×
        </button>
        
        {movie.poster_path && (
          <div className="modal-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="modal-poster-image"
            />
          </div>
        )}

        <div className="modal-info">
          <h2 className="modal-title">{movie.title}</h2>
          
          <div className="modal-meta">
            <div className="modal-rating">
              <span className="rating-label">평점</span>
              <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
            </div>
            {movie.release_date && (
              <div className="modal-release-date">
                <span className="release-label">개봉일</span>
                <span className="release-value">{movie.release_date}</span>
              </div>
            )}
          </div>

          {movie.overview && (
            <div className="modal-overview">
              <h3 className="overview-title">줄거리</h3>
              <p className="overview-text">{movie.overview}</p>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="imdb-button"
              onClick={handleImdbSearch}
            >
              IMDb에서 검색하기
            </button>
            <button
              className="close-button"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailModal

