
import { LpResponse } from "../types/lps";
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

