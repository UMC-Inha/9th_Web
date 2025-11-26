
import { LpLikesResponse, LpResponse } from "../types/lps";
import { axiosInstance } from "./axiosInstance"

export const getLps = async (data : {cursor : number, limit : number, search : string, order : string}) : Promise<LpResponse> => {
    const response = await axiosInstance.get('/lps', {
        params : {
            cursor : data.cursor,
            limit : data.limit || 10,
            search : data.search,
            order : data.order,
        }
    })

    return response.data;
}

export const getLpDetail = async (lpId : number) : Promise<LpResponse> => {
    const response = await axiosInstance.get(`/lps/${lpId}`, {
        
    })

    return response.data;
}

export const postLps = async (data: { tags: string[]; title: string; content: string; thumbnail: string; published: boolean; }) => {
    const response = await axiosInstance.post(`/lps`, data); 

    return response.data;
}

export const patchLp = async (lpId: number, data: {
    title?: string;
    content?: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
}) => {
    const response = await axiosInstance.patch(`/lps/${lpId}`, data);
    return response.data;
};


export const postLikes = async (lpId : number) : Promise<LpLikesResponse> => {
    const response = await axiosInstance.post(`/lps/${lpId}/likes`, {

    })

    return response.data;
}

export const deleteLikes = async (lpId : number) : Promise<LpLikesResponse> => {
    const response = await axiosInstance.delete(`/lps/${lpId}/likes`, {

    })

    return response.data;
}