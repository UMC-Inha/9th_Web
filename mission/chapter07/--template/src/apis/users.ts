import axiosInstance from "../apis/axios";

export type UpdateMePayload = {
  name: string;
  bio?: string | null;
  avatar?: File | null; // 파일 있을 때만 FormData로 전송
};

export async function getMe() {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data; // CommonResponse<{...}>
}

export async function updateMe(payload: UpdateMePayload) {
  // 파일 있으면 FormData, 아니면 JSON
  if (payload.avatar instanceof File) {
    const fd = new FormData();
    fd.append("name", payload.name);
    if (typeof payload.bio === "string") fd.append("bio", payload.bio);
    fd.append("avatar", payload.avatar);
    const { data } = await axiosInstance.patch("/v1/users", fd);
    return data; // 가능하면 서버가 최신 사용자 객체를 data로 돌려주도록
  } else {
    const body: Record<string, any> = { name: payload.name };
    if (typeof payload.bio === "string") body.bio = payload.bio;
    const { data } = await axiosInstance.patch("/v1/users", body);
    return data;
  }
}

export async function deleteUser() {
  const { data } = await axiosInstance.delete("/v1/users");
  return data;
}
