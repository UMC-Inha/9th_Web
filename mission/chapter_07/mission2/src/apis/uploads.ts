import { axiosInstance } from "./axios.js";

export interface UploadResponse {
  imageUrl: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data; // { imageUrl: string }
}
