# 영화 검색 애플리케이션

TMDB API를 활용한 영화 검색 애플리케이션입니다.

## 기능

### 1. 영화 검색 기능
- 영화 제목으로 검색
- 성인 콘텐츠 포함 여부 선택
- 언어 선택 (한국어, 영어, 일본어)
- 엔터 키로 검색 가능

### 2. 영화 상세 정보 모달
- 영화 포스터 및 배경 이미지
- 제목, 평점, 개봉일, 줄거리 등 상세 정보
- IMDb 검색 링크
- 모달 닫기 기능

### 3. 성능 최적화
- React.memo를 사용한 컴포넌트 메모이제이션
- useCallback을 사용한 함수 메모이제이션
- useMemo를 사용한 계산 결과 캐싱

## 설치 및 실행

### 1. 패키지 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 TMDB API 키를 설정하세요:
```
VITE_TMDB_KEY=your_tmdb_api_key_here
```

TMDB API 키는 [TMDB](https://www.themoviedb.org/settings/api)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행
```bash
pnpm dev
```

## 성능 최적화 적용 내역

### 1. React.memo 적용
- `MovieSearchForm`: 검색 폼 컴포넌트 메모이제이션
- `MovieCard`: 영화 카드 컴포넌트 메모이제이션
- `MovieDetailModal`: 모달 컴포넌트 메모이제이션

### 2. useCallback 적용
- `handleSearch`: 검색 함수 메모이제이션
- `handleCardClick`: 카드 클릭 핸들러 메모이제이션
- `handleCloseModal`: 모달 닫기 핸들러 메모이제이션
- `handleSearchQueryChange`: 검색어 변경 핸들러 메모이제이션
- `handleIncludeAdultChange`: 성인 콘텐츠 체크박스 변경 핸들러 메모이제이션
- `handleLanguageChange`: 언어 변경 핸들러 메모이제이션

### 3. useMemo 적용
- `movieCards`: 영화 카드 리스트 렌더링 결과 메모이제이션

### 최적화 효과
- 불필요한 리렌더링 방지
- 검색어 입력 시 영화 카드 리렌더링 최소화
- 필터 변경 시 전체 컴포넌트 리렌더링 방지

## 프로젝트 구조

```
src/
├── components/
│   ├── MovieCard.tsx          # 영화 카드 컴포넌트
│   ├── MovieDetailModal.tsx   # 영화 상세 모달 컴포넌트
│   └── MovieSearchForm.tsx    # 검색 폼 컴포넌트
├── lib/
│   └── tmdb.ts                # TMDB API 유틸리티
├── types/
│   └── movie.ts               # 영화 관련 타입 정의
├── App.tsx                    # 메인 앱 컴포넌트
├── main.tsx                   # 진입점
└── index.css                  # 전역 스타일
```

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- TMDB API
