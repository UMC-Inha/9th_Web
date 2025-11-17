import { axiosInstance } from "./axiosInstance"

export const getUsers = async () => {
    const response = await axiosInstance.get(`/users/me`, {

    })

    return response.data;
}

export interface PatchUserData {
    name: string;
    bio?: string | null;
    avatar?: string | null;
}

export const patchUsers = async (data : PatchUserData) => {
    const response = await axiosInstance.patch(`/users`, data)

    return response.data;
}