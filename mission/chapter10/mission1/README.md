# 영화 검색 애플리케이션

TMDB API를 사용한 영화 검색 애플리케이션입니다.

## 설치 및 실행

1. 패키지 설치
```bash
pnpm install
```

2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
```
VITE_TMDB_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDMzYmE1ZWE4NWJhN2E2Nzc1ODI1ZGY4OGJhNDkwMCIsIm5iZiI6MTc1OTM4Nzc2Mi4wNTksInN1YiI6IjY4ZGUyMDcyNTZlODIxMzkwZmZkMjEwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JVCyPuBdfRl0tIePXpbj1xyTGppUPQaOiv6vSM0yUyQ
```

3. 개발 서버 실행
```bash
pnpm dev
```

## 주요 기능

- 영화 제목 검색
- 성인 콘텐츠 포함 여부 선택
- 언어 선택 (한국어, 영어, 일본어)
- 영화 상세 정보 모달
- IMDb 검색 링크

## 성능 최적화

다음 최적화 기법이 적용되어 있습니다:

1. **React.memo**: 컴포넌트 불필요한 리렌더링 방지
   - `SearchForm`, `MovieCard`, `MovieList`, `MovieModal` 컴포넌트에 적용

2. **useCallback**: 함수 참조 안정화
   - `handleSearch`, `handleMovieClick`, `handleCloseModal` 등에 적용

3. **useMemo**: 계산 결과 메모이제이션
   - `memoizedMovies`로 영화 리스트 메모이제이션

## React DevTools Profiler 사용법

1. Chrome에 React Developer Tools 확장 프로그램 설치
2. 개발자 도구에서 "Profiler" 탭 열기
3. 녹화 버튼 클릭 후 영화 검색 수행
4. 녹화 중지 후 리렌더링 분석
5. 최적화 전/후 비교하여 성능 개선 확인

