import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import type { MovieFilters, MovieResponse } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "",
    include_adult: false,
    language: "ko-KR",
  });
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, error, isLoading } = useFetch<MovieResponse>(
    shouldFetch ? "/search/movie" : "",
    {
      params: {
        query: filters.query,
        include_adult: filters.include_adult,
        language: filters.language,
      } as MovieFilters,
    }
  );

  useEffect(() => {
    if (shouldFetch && filters.query) {
      // useFetch가 자동으로 재호출되도록 하려면 의존성 배열을 조정해야 합니다
      // 하지만 현재 useFetch는 의존성 배열이 비어있으므로,
      // 필터가 변경될 때마다 재호출되도록 수정이 필요합니다
    }
  }, [filters, shouldFetch]);

  const handleFilterChange = (newFilters: MovieFilters) => {
    setFilters(newFilters);
    if (newFilters.query.trim()) {
      setShouldFetch(true);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <MovieFilter onChange={handleFilterChange} />
      </div>
      <div className="py-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            로딩 중입니다...
          </div>
        ) : (
          <MovieList movies={data?.results || []} />
        )}
      </div>
    </div>
  );
}
