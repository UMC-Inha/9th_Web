const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API

export interface MovieSearchParams {
  query: string
  include_adult?: boolean
  language?: string
  page?: number
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

export interface MovieSearchResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface GenreListResponse {
  genres: Genre[]
}

export const searchMovies = async (
  params: MovieSearchParams
): Promise<MovieSearchResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('VITE_TMDB_API 환경 변수가 설정되지 않았습니다.')
  }

  const searchParams = new URLSearchParams({
    query: params.query,
    include_adult: params.include_adult ? 'true' : 'false',
    language: params.language || 'ko-KR',
    page: params.page?.toString() || '1',
  })

  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `TMDB API 호출 실패: ${response.status} ${response.statusText}`
    
    try {
      const errorData = JSON.parse(errorText)
      if (errorData.status_message) {
        errorMessage = `TMDB API 오류: ${errorData.status_message}`
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    
    throw new Error(errorMessage)
  }

  return response.json()
}

export const getMovieGenres = async (
  language?: string
): Promise<GenreListResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error('VITE_TMDB_API 환경 변수가 설정되지 않았습니다.')
  }

  const searchParams = new URLSearchParams()
  if (language) {
    searchParams.append('language', language)
  }

  const url = `${TMDB_BASE_URL}/genre/movie/list${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `TMDB API 호출 실패: ${response.status} ${response.statusText}`

    try {
      const errorData = JSON.parse(errorText)
      if (errorData.status_message) {
        errorMessage = `TMDB API 오류: ${errorData.status_message}`
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

