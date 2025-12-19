import type { FormEvent } from "react";
import React from "react";

type Props = {
  query: string;
  includeAdult: boolean;
  language: "ko-KR" | "en-US" | "ja-JP";
  onChangeQuery: (v: string) => void;
  onChangeIncludeAdult: (v: boolean) => void;
  onChangeLanguage: (v: "ko-KR" | "en-US" | "ja-JP") => void;
  onSubmit: () => void;
};

function SearchBar({
  query,
  includeAdult,
  language,
  onChangeQuery,
  onChangeIncludeAdult,
  onChangeLanguage,
  onSubmit,
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="border rounded px-3 py-2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => onChangeIncludeAdult(e.target.checked)}
          />
          성인 콘텐츠 포함
        </label>

        <label className="flex items-center gap-2">
          <span className="min-w-16">언어</span>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Props["language"])}
            className="border rounded px-3 py-2"
          >
            <option value="ko-KR">한국어 (ko-KR)</option>
            <option value="en-US">영어 (en-US)</option>
            <option value="ja-JP">일본어 (ja-JP)</option>
          </select>
        </label>

        <button type="submit" className="border rounded px-3 py-2">
          검색
        </button>
      </form>
    </section>
  );
}

export default React.memo(SearchBar);
