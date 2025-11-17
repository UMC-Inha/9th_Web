import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.js";
import type { InternalAxiosRequestConfig } from "axios";
const baseURL = import.meta.env.VITE_SERVER_API_URL;

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (rawToken) {
      let token = rawToken;
      try {
        token = JSON.parse(rawToken);
      } catch {}

      token = token.replace(/"/g, "");

      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const rawRefreshToken = localStorage.getItem(
      LOCAL_STORAGE_KEY.refreshToken
    );
    if (!rawRefreshToken) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      return Promise.reject(error);
    }

    try {
      const refreshToken = JSON.parse(rawRefreshToken);

      const refreshRes = await axios.post(`${baseURL}/v1/auth/refresh`, {
        refreshToken,
      });

      const payload = (refreshRes.data as any).data ?? refreshRes.data;

      const newAccessToken = payload.accessToken;
      const newRefreshToken = payload.refreshToken;

      if (!newAccessToken) {
        throw new Error("새 accessToken을 응답에서 찾을 수 없습니다.");
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEY.accessToken,
        JSON.stringify(newAccessToken)
      );
      if (newRefreshToken) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.refreshToken,
          JSON.stringify(newRefreshToken)
        );
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);
