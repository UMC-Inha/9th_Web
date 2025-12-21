import { memo } from 'react'
import './MovieSearchForm.css'

interface AdultContentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

function AdultContentCheckbox({ checked, onChange }: AdultContentCheckboxProps) {
  console.log('AdultContentCheckbox 렌더링')
  
  return (
    <div className="form-group">
      <label htmlFor="adult-content" className="checkbox-label">
        <input
          id="adult-content"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox-input"
        />
        <span>성인 콘텐츠 포함</span>
      </label>
    </div>
  )
}

export default memo(AdultContentCheckbox)

