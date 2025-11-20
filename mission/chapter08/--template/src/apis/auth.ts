import type {
  RequestSignupDto,
  RequestSigninDto,     
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSingupDto, 
} from "../types/auth";
import api from "./axios";

export const postSignup = async (body: RequestSignupDto) => {
  const { data } = await api.post<ResponseSingupDto>("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto) => {
  const { data } = await api.post<ResponseSigninDto>("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async () => {
  const { data } = await api.get<ResponseMyInfoDto>("/v1/users/me");
  return data;
};

export const postSignout = async () => {
  const { data } = await api.post("/v1/auth/signout");
  return data;
};
