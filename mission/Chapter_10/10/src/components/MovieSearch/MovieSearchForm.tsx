import { useState, useCallback, memo } from 'react'
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
  console.log('MovieSearchForm 컴포넌트 렌더링')
  
  const [movieTitle, setMovieTitle] = useState('')
  const [includeAdult, setIncludeAdult] = useState(false)
  const [language, setLanguage] = useState('ko-KR')

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      movieTitle,
      includeAdult,
      language,
    })
  }, [movieTitle, includeAdult, language, onSubmit])

  const handleMovieTitleChange = useCallback((value: string) => {
    setMovieTitle(value)
  }, [])

  const handleIncludeAdultChange = useCallback((checked: boolean) => {
    setIncludeAdult(checked)
  }, [])

  const handleLanguageChange = useCallback((value: string) => {
    setLanguage(value)
  }, [])

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <MovieTitleInput value={movieTitle} onChange={handleMovieTitleChange} />
        <AdultContentCheckbox checked={includeAdult} onChange={handleIncludeAdultChange} />
        <LanguageSelect value={language} onChange={handleLanguageChange} />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>
    </div>
  )
}

export default memo(MovieSearchForm)

