export interface SearchResultItem {
  id: string;
  name: string;
}

export interface SearchResponse {
  items: SearchResultItem[];
  nextCursor: string | null;
}

interface FetchParams {
  query: string;
  cursor: string | null;
}

export async function fetchSearchResults({
  query,
  cursor,
}: FetchParams): Promise<SearchResponse> {
  console.log("API 호출:", query, cursor);

  // 테스트용 더미 데이터 생성
  const items = Array.from({ length: 10 }).map((_, i) => ({
    id: `${cursor ?? "0"}-${i}`,
    name: `${query} 결과 ${cursor ?? 0}-${i}`,
  }));

  // cursor가 0 → 1 → 2 → null 순서로 움직이게
  const nextCursor =
    cursor === null ? "1" : cursor === "1" ? "2" : null;

  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ items, nextCursor }),
      300
    )
  );
}
