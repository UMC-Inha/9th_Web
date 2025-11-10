import axiosInstance from './axios';

export const login = (id: string, password: string) => {
  return axiosInstance.post('/auth/login', { id, password });
};

export const getUserInfo = () => {
  return axiosInstance.get('/user/me');
};
