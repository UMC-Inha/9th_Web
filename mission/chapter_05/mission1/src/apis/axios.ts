import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      try {
        const token = JSON.parse(accessToken);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse accessToken from localStorage", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
