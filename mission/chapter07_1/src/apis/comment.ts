import { number } from "zod";
import { LpCommentsResponse } from "../types/comments";
import { axiosInstance } from "./axiosInstance"

interface GetCommentsParams {
    lpId: number;
    cursor?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}

export const getComments = async ({lpId, cursor, limit = 10, order = 'desc'} : GetCommentsParams) : Promise<LpCommentsResponse>=> {
    const response = await axiosInstance.get(`/lps/${lpId}/comments`, {
        params : {
            cursor,
            limit,
            order,
        }
    });

    return response.data;
}

export const postComments = async (data: { lpId : number; content : string }) => {
    const response = await axiosInstance.post(`/lps/${data.lpId}/comments`, {
        content: data.content,
    });

    return response.data;
};

export const patchComments = async (data: { lpId : number; commentId : number; content : string }) => {
    const response = await axiosInstance.patch(`/lps/${data.lpId}/comments/${data.commentId}`, {
        content: data.content,
    });
    
    return response.data;
};

export const deleteComments = async (data: { lpId : number; commentId : number }) => {
    const response = await axiosInstance.delete(`/lps/${data.lpId}/comments/${data.commentId}`, {

    });
    
    return response.data;
};