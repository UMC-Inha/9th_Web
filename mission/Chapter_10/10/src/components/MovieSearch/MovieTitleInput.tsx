import { memo } from 'react'
import './MovieSearchForm.css'

interface MovieTitleInputProps {
  value: string
  onChange: (value: string) => void
}

function MovieTitleInput({ value, onChange }: MovieTitleInputProps) {
  console.log('MovieTitleInput 렌더링')
  
  return (
    <div className="form-group">
      <label htmlFor="movie-title">영화 제목</label>
      <input
        id="movie-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="영화 제목을 입력하세요"
        className="movie-input"
      />
    </div>
  )
}

export default memo(MovieTitleInput)

