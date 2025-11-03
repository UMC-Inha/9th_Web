import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, 
    
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    
    async (error : AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {__retry? : boolean};

        if (error.response?.status === 401 && !originalRequest.__retry) {
            originalRequest.__retry = true;

            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                alert ('로그인 세션이 만료되었습니다. 다시 로그인 해 주세요!');

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {
                const response = await axiosInstance.post('/auth/refresh', {
                    refreshToken,
                })

                const newAccessToken = response.data?.data?.accessToken;

                if (!newAccessToken) {
                    alert ('새 Access Token 이 발급되지 않았습니다.');

                    localStorage.setItem("accessToken", newAccessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return axiosInstance(originalRequest);
                }
            }

            catch (error) {
                alert ('로그인 세션이 만료되었습니다. 다시 로그인 해주세요 !');

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/login";

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)