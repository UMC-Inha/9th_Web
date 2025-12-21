import { memo, type FormEvent } from 'react';

interface MovieSearchFormProps {
  searchQuery: string;
  includeAdult: boolean;
  language: string;
  onSearchQueryChange: (value: string) => void;
  onIncludeAdultChange: (value: boolean) => void;
  onLanguageChange: (value: string) => void;
  onSearch: (e: FormEvent<HTMLFormElement>) => void;
}

const MovieSearchForm = memo(({
  searchQuery,
  includeAdult,
  language,
  onSearchQueryChange,
  onIncludeAdultChange,
  onLanguageChange,
  onSearch,
}: MovieSearchFormProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={onSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="영화 제목을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="adult-content"
              checked={includeAdult}
              onChange={(e) => onIncludeAdultChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="adult-content" className="text-sm text-gray-700">
              성인 콘텐츠 포함
            </label>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="language" className="text-sm text-gray-700 whitespace-nowrap">
              언어:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ko-KR">한국어 (ko-KR)</option>
              <option value="en-US">영어 (en-US)</option>
              <option value="ja-JP">일본어 (ja-JP)</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
});

MovieSearchForm.displayName = 'MovieSearchForm';

export default MovieSearchForm;

