import { useParams } from 'react-router-dom'

function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>()

  return (
    <div className="movie-detail-page">
      <h1>영화 상세 페이지</h1>
      <p>영화 ID: {movieId}</p>
      <p>이 페이지는 라우팅 테스트용입니다. 실제 디자인은 추후 구현 예정입니다.</p>
    </div>
  )
}

export default MovieDetail

