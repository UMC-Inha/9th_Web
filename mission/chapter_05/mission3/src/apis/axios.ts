import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.js";
import type { InternalAxiosRequestConfig } from "axios";
const baseURL = import.meta.env.VITE_SERVER_API_URL;

export const axiosInstance = axios.create({
  baseURL,
});

// 요청 인터셉터: access token 자동으로 붙이기
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      try {
        const token = JSON.parse(accessToken);
        // headers가 없을 수도 있으니까 방어
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse accessToken from localStorage", e);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 → refresh → 원래 요청 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1) 401 아니면 그냥 실패
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 2) 이미 한 번 시도한 요청이면 무한루프 방지
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // 3) refresh token 없으면 재발급도 못함 → 로그인으로
    const rawRefreshToken = localStorage.getItem(
      LOCAL_STORAGE_KEY.refreshToken
    );
    if (!rawRefreshToken) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      return Promise.reject(error);
    }

    try {
      const refreshToken = JSON.parse(rawRefreshToken);

      // 4) 여기서만 '순수 axios'로 직접 호출해서 순환참조 방지
      //    백엔드가 /v1/auth/refresh 아니면 이 주소만 바꾸세요
      const refreshRes = await axios.post(`${baseURL}/v1/auth/refresh`, {
        refreshToken,
      });

      // 5) 서버가 data 안에 data를 한 번 더 감싸는 경우도 있어서 둘 다 대응
      const payload = (refreshRes.data as any).data ?? refreshRes.data;

      const newAccessToken = payload.accessToken;
      const newRefreshToken = payload.refreshToken;

      if (!newAccessToken) {
        throw new Error("새 accessToken을 응답에서 찾을 수 없습니다.");
      }

      // 6) 토큰 다시 저장
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

      // 7) 실패했던 요청에 새 토큰 박기
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // 8) 그리고 다시 요청
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // refresh도 실패 → 완전 로그아웃 상태로
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      window.location.href = "/login"; // 선택
      return Promise.reject(refreshError);
    }
  }
);
