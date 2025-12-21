import { memo } from 'react'
import type { Movie } from '../../services/tmdbApi'
import '../MovieSearchForm.css'

interface MovieCardProps {
  movie: Movie
  onClick: (movie: Movie) => void
}

function MovieCard({ movie, onClick }: MovieCardProps) {
  console.log(`MovieCard 렌더링: ${movie.title}`)
  
  return (
    <div
      className="movie-card"
      onClick={() => onClick(movie)}
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
  )
}

export default memo(MovieCard)

