import { axiosInstance } from "./axios.js";

export interface CommentAuthor {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface CommentItem {
  id: number;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

export interface CommentListResponse {
  data: CommentItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

/** 📌 댓글 목록 조회 */
export async function getComments(
  lpId: number,
  cursor?: number,
  limit = 10,
  order: "asc" | "desc" = "asc"
): Promise<CommentListResponse> {
  const res = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return res.data.data; // 🚨 API 응답 형태에 맞춰 data.data 반환
}

/** 📌 댓글 생성 */
export async function createComment(lpId: number, content: string) {
  const res = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return res.data.data;
}

/** 📌 댓글 수정 */
export async function updateComment(
  lpId: number,
  commentId: number,
  content: string
) {
  const res = await axiosInstance.post(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return res.data.data;
}

/** 📌 댓글 삭제 */
export async function deleteComment(lpId: number, commentId: number) {
  const res = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return res.data.data;
}
