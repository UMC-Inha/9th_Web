import { axiosInstance } from "../apis/axios";

export interface TagItem {
  id: number;
  name: string;
}

export interface FetchTagsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: TagItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export async function fetchTags(): Promise<TagItem[]> {
  const res = await axiosInstance.get("/v1/tags", {
    params: { limit: 50, order: "asc" },
  });

  return res.data.data.data; // 🔥 바로 태그 배열만 반환
}
