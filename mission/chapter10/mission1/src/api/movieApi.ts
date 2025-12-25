import type { MovieSearchResponse, Language } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.error('TMDB API 키가 설정되지 않았습니다. .env 파일에 VITE_TMDB_API_KEY를 설정해주세요.');
}

export const searchMovies = async (
  query: string,
  includeAdult: boolean,
  language: Language
): Promise<MovieSearchResponse> => {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  const languageCode = language.split('-')[0]; // ko-KR -> ko
  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=${languageCode}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.status_message || `영화 검색에 실패했습니다. (${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('영화 검색 중 오류가 발생했습니다.');
  }
};

