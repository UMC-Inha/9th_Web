import { memo } from 'react'
import './MovieSearchForm.css'

interface LanguageSelectProps {
  value: string
  onChange: (value: string) => void
}

function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  console.log('LanguageSelect 렌더링')
  
  return (
    <div className="form-group">
      <label htmlFor="language">언어</label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="language-select"
      >
        <option value="ko-KR">한국어 (ko-KR)</option>
        <option value="en-US">영어 (en-US)</option>
        <option value="ja-JP">일본어 (ja-JP)</option>
      </select>
    </div>
  )
}

export default memo(LanguageSelect)

