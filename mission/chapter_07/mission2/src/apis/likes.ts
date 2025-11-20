import { axiosInstance } from "./axios";

export const likeLp = (lpId: number) =>
  axiosInstance.post(`/v1/lps/${lpId}/likes`);

export const unlikeLp = (lpId: number) =>
  axiosInstance.delete(`/v1/lps/${lpId}/likes`);
