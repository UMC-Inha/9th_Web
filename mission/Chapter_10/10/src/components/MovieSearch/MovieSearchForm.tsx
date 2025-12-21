import { useState } from 'react'
import MovieTitleInput from './MovieTitleInput'
import AdultContentCheckbox from './AdultContentCheckbox'
import LanguageSelect from './LanguageSelect'
import './MovieSearchForm.css'

interface MovieSearchFormProps {
  onSubmit: (data: {
    movieTitle: string
    includeAdult: boolean
    language: string
  }) => void
}

function MovieSearchForm({ onSubmit }: MovieSearchFormProps) {
  const [movieTitle, setMovieTitle] = useState('')
  const [includeAdult, setIncludeAdult] = useState(false)
  const [language, setLanguage] = useState('ko-KR')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      movieTitle,
      includeAdult,
      language,
    })
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <MovieTitleInput value={movieTitle} onChange={setMovieTitle} />
        <AdultContentCheckbox checked={includeAdult} onChange={setIncludeAdult} />
        <LanguageSelect value={language} onChange={setLanguage} />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>
    </div>
  )
}

export default MovieSearchForm

