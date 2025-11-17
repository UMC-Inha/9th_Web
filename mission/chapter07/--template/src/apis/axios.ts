// src/apis/axios.ts
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constans/key";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL ?? "http://localhost:8000",
  withCredentials: false,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  // 토큰
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    const h = config.headers as any;
    if (h && typeof h.set === "function") {
      h.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
    }
  }
  const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData) {
    if ((config.headers as any)?.["Content-Type"]) {
      delete (config.headers as any)["Content-Type"];
    }
  } else {
    (config.headers as any) = { ...(config.headers || {}), "Content-Type": "application/json" };
  }

  return config;
});

export default axiosInstance;
