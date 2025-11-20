import type { PaginationDto } from "../types/common";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import axiosInstance from "./axios";
import { PAGINATION_ORDER } from "../enums/common";

export const getLpList=async(paginationDto:PaginationDto):Promise<ResponseLpListDto>=>{
    const{data}=await axiosInstance.get("/v1/lps",{
        params:paginationDto
    });
    return data;
}

export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    return data;
  };

import type { ResponseLpCommentsDto } from "../types/lp";
import type { CreateLpPayload } from "../types/auth";

// 이미지 업로드
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/v1/uploads", formData);
  return data.data.imageUrl;
};

// LP 생성
export const createLp = async (body: CreateLpPayload) => {
  const { data } = await axiosInstance.post("/v1/lps", {
    title: body.title,
    content: body.content,
    tags: body.tags,
    thumbnail: body.thumbnail || "",
    published: body.published ?? true,
  });
  return data;
};

export const getLpComments = async (
  lpId: number,
  params: { cursor?: number; order?: PAGINATION_ORDER; limit?: number }
): Promise<ResponseLpCommentsDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, { params });
  return data;
};

// LP 수정
export const updateLp = async (lpId: number, body: CreateLpPayload) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, {
    title: body.title,
    content: body.content,
    tags: body.tags,
    thumbnail: body.thumbnail || "",
    published: body.published ?? true,
  });
  return data;
};

// LP 삭제
export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

// 좋아요 추가
export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

// 좋아요 취소
export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

// 내가 좋아요한 LP 목록 조회
export const getMyLikedLps = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps/likes/me", {
    params: paginationDto,
  });
  return data;
};

// 특정 유저가 좋아요한 LP 목록 조회
export const getUserLikedLps = async (
  userId: number,
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/likes/${userId}`, {
    params: paginationDto,
  });
  return data;
};