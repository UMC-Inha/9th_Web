import { axiosInstance } from "../apis/axios";
import { uploadImage } from "./uploads";

export interface LpDetail {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
  author: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
  };
}

export interface LpItem {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

/** 댓글 무한스크롤 response 타입 */
export interface FetchLpsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: LpItem[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

// ===================== 🔹 LP 목록 조회 (GET) ===================== //

export async function fetchLps(
  order: "asc" | "desc",
  cursor?: number,
  limit = 10,
  search?: string
): Promise<FetchLpsResponse> {
  const res = await axiosInstance.get("/v1/lps", {
    params: { cursor, limit, order, search },
  });
  return res.data;
}

// ===================== 🔹 LP 상세 조회 (GET) ===================== //

export async function fetchLpDetail(lpId: number): Promise<LpDetail> {
  const res = await axiosInstance.get(`/v1/lps/${lpId}`);
  return res.data.data;
}

// ===================== 🔹 LP 생성 (POST) ===================== //

/**
 * LP 생성 요청 타입
 * thumbnail: File | null
 * tags: string[] | null (추후 확장 가능)
 */
export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail?: File | null;
  tags?: string[];
}

/** 📌 LP 생성 함수 */
export async function createLp(req: CreateLpRequest) {
  let thumbnailUrl: string | null = null;

  if (req.thumbnail instanceof File) {
    const uploadRes = await uploadImage(req.thumbnail);
    thumbnailUrl = uploadRes.imageUrl;
  }

  const res = await axiosInstance.post("/v1/lps", {
    title: req.title,
    content: req.content,
    thumbnail: thumbnailUrl, // 👍 URL 최종 전달
    tags: req.tags ?? [],
  });

  return res.data;
}

/** LP 수정 */
export async function updateLp(
  lpId: number,
  dto: { title?: string; content?: string; tags?: string[] }
) {
  const res = await axiosInstance.patch(`/v1/lps/${lpId}`, dto);
  return res.data.data;
}

/** LP 삭제 */
export async function deleteLp(lpId: number) {
  const res = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return res.data.data;
}
