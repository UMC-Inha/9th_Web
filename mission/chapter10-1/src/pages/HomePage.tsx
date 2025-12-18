import { useCallback, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import type { Movie, MovieResponse } from "../types/movie";
import { searchMovies } from "../apis/tmdb";

export default function HomePage() {
  const [query, setQuery] = useState("어벤져스");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<"ko-KR" | "en-US" | "ja-JP">("ko-KR");

  const [data, setData] = useState<MovieResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState<Movie | null>(null);

  // ✅ params 객체를 useMemo로 고정 (불필요 렌더/호출 방지)
  const params = useMemo(
    () => ({
      query: query.trim(),
      include_adult: includeAdult,
      language,
    }),
    [query, includeAdult, language]
  );

  const handleSubmit = useCallback(async () => {
    if (!params.query) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchMovies(params);
      setData(result);
    } catch {
      setError("데이터를 가져오는데 에러가 발생했습니다.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const handleClickMovie = useCallback((movie: Movie) => {
    setSelected(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  const movies = data?.results ?? [];

  return (
    <div className="min-h-screen">
      <SearchBar
        query={query}
        includeAdult={includeAdult}
        language={language}
        onChangeQuery={setQuery}
        onChangeIncludeAdult={setIncludeAdult}
        onChangeLanguage={setLanguage}
        onSubmit={handleSubmit}
      />

      <section className="w-full max-w-5xl mx-auto px-4">
        {isLoading && <div className="py-4">로딩중...</div>}
        {error && <div className="py-4">{error}</div>}
        {!isLoading && !error && movies.length === 0 && (
          <div className="py-4">검색 결과가 없습니다.</div>
        )}
      </section>

      {movies.length > 0 && <MovieGrid movies={movies} onClickMovie={handleClickMovie} />}

      {selected && <MovieModal movie={selected} onClose={handleCloseModal} />}
    </div>
  );
}
