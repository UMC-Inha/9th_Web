import api from "./axios";

export async function getComments(
  lpId: number,
  cursor?: number,
  limit = 10,
  order: "asc" | "desc" = "desc"
) {

  const { data } = await api.get(`/v1/lps/${lpId}/comments`, {
    params: { order, limit, cursor },
  });
  return data; 
}

export async function createComment(lpId: number, content: string, token: string) {
  // POST /v1/lps/{lpId}/comments  body: { content }
  const { data } = await api.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
}

export async function updateComment(lpId: number, commentId: number, content: string, token: string) {
  // PATCH /v1/lps/{lpId}/comments/{commentId}
  const { data } = await api.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
}

export async function deleteComment(lpId: number, commentId: number, token: string) {
  // DELETE /v1/lps/{lpId}/comments/{commentId}
  const { data } = await api.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
}
