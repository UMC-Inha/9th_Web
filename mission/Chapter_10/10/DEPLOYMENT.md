# Vercel 배포 가이드

## ✅ 완료된 작업

1. ✅ `react-router-dom` 라이브러리 추가 (package.json)
2. ✅ 영화 상세페이지 라우팅 구현 (`/movies/:movieId`)
3. ✅ `vercel.json` 파일 생성 (SPA 새로고침 404 에러 방지)

## 📋 배포 체크리스트

### 1. 의존성 설치

```bash
cd /Users/hongsujin/9th_Web/mission/Chapter_10/10
npm install
```

### 2. GitHub 레포지토리 준비

```bash
# Git 초기화 (이미 되어있다면 생략)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "영화 검색 앱 배포 준비"

# GitHub 레포지토리 생성 후 연결
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

⚠️ **주의**: `.env` 파일은 `.gitignore`에 포함되어 있어 자동으로 제외됩니다.

### 3. Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 전역 설치
npm install -g vercel

# Vercel 로그인
vercel login
```

### 4. Preview 배포

```bash
# 프로젝트 디렉토리에서 실행
cd /Users/hongsujin/9th_Web/mission/Chapter_10/10
vercel
```

질문에 답변:
- Set up and deploy? **Y**
- Which scope? (본인 계정 선택)
- Link to existing project? **N** (처음 배포)
- What's your project's name? (프로젝트 이름 입력 또는 Enter)
- In which directory is your code located? **./** (Enter)

Preview URL이 표시되면 접속하여 확인하세요.

### 5. Production 배포

```bash
vercel --prod
```

Production URL이 표시되면 접속하여 확인하세요.

### 6. 환경변수 설정 (필수!)

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 이동
4. 다음 환경변수 추가:
   - **Name**: `VITE_TMDB_API`
   - **Value**: (실제 TMDB API 키)
   - **Environment**: Production, Preview, Development 모두 선택
5. **Save** 클릭
6. **중요**: 환경변수 저장 후 반드시 재배포 필요!

```bash
vercel --prod
```

### 7. 라우팅 테스트

- 홈페이지: `https://your-project.vercel.app/`
- 영화 상세페이지: `https://your-project.vercel.app/movies/123`
- 새로고침 시 404 에러가 발생하지 않는지 확인

## 📁 생성된 파일

- `vercel.json`: SPA 라우팅을 위한 rewrite 설정
- `src/pages/Home.tsx`: 홈 페이지 컴포넌트
- `src/pages/MovieDetail.tsx`: 영화 상세 페이지 컴포넌트 (라우팅 테스트용)

## 🔧 문제 해결

### 새로고침 시 404 에러
- `vercel.json` 파일이 프로젝트 루트에 있는지 확인
- Vercel 대시보드에서 프로젝트 재배포

### 환경변수 적용 안됨
- 환경변수 저장 후 반드시 재배포 필요
- `vercel --prod` 명령어 실행

### 빌드 에러
- 로컬에서 `npm run build` 실행하여 빌드 확인
- TypeScript 오류나 린터 오류 확인

