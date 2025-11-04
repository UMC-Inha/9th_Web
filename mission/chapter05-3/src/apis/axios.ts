import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useLocalStorage } from '../hooks/useLocalStorage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1', // ✅ 서버 주소
  withCredentials: true, // 필요시 쿠키 인증도 포함 가능
});

// ✅ 토큰이 있을 경우 자동 헤더 주입
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ 토큰 만료 시 재발급 로직
let refreshPromise: Promise<any> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { set, remove, get } = useLocalStorage();

    const originalRequest = error.config;

    // ✅ Access Token 만료 감지 (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지 플래그

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = get(LOCAL_STORAGE_KEY.refreshToken);
            if (!refreshToken) throw new Error('No refresh token');

            const { data } = await axios.post('http://localhost:8000/v1/auth/refresh', {
              refreshToken,
            });

            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken;

            set(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
            set(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

            return newAccessToken;
          } catch (err) {
            console.error('❌ Token refresh failed', err);
            remove(LOCAL_STORAGE_KEY.accessToken);
            remove(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = '/login';
            throw err;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest); // ✅ 실패했던 요청 재시도
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
