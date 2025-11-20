import type {
  RequestSignupDto,
  ResponseSignupDto,
  RequestSigninDto,
  ResponseSigninDto,
  ResponseMyInfoDto,
} from "../types/auth.js";

import { axiosInstance } from "./axios.js";

export async function signin(email: string, password: string) {
  const res = await axiosInstance.post("/v1/auth/signin", {
    email,
    password,
  });

  return res.data.data;
}

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);

  return data;
};

export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

export const postRefresh = async (refreshToken: string) => {
  const { data } = await axiosInstance.post("/v1/auth/refresh", {
    refreshToken,
  });
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};
