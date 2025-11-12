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

export const postComments = async ( data : {lpId : number} ) : Promise<LpCommentsResponse>=> {
    const response = await axiosInstance.get(`/lps/${data}/comments`, {

    });

    return response.data;
}