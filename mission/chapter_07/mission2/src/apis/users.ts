import { axiosInstance } from "./axios.js";
import { uploadImage } from "./uploads.js";

export interface UpdateUserRequest {
  name?: string;
  bio?: string;
  avatar?: File | null;
}

export async function updateUser(req: UpdateUserRequest) {
  let avatarUrl: string | undefined;

  if (req.avatar instanceof File) {
    const uploaded = await uploadImage(req.avatar);
    avatarUrl = uploaded.imageUrl;
  }

  const res = await axiosInstance.patch("/v1/users/me", {
    name: req.name,
    bio: req.bio,
    avatar: avatarUrl,
  });

  return res.data;
}
