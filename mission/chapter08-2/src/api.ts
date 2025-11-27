export interface Item {
  id: string;
  title: string;
}

export interface PageResponse {
  items: Item[];
  nextCursor: string | null;
}

interface FetchParams {
  cursor: string | null;
}

export async function fetchItems({
  cursor,
}: FetchParams): Promise<PageResponse> {
  console.log("API 호출:", cursor);

  const items = Array.from({ length: 50 }).map((_, i) => ({
  id: `${cursor ?? "0"}-${i}`,
  title: `아이템 ${cursor ?? 0}-${i}`,
}));


  const nextCursor =
    cursor === null ? "1" : cursor === "1" ? "2" : null;

  return new Promise((resolve) =>
    setTimeout(() => resolve({ items, nextCursor }), 500)
  );
}
