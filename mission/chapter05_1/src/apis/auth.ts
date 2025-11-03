import { axiosInstance } from "./axiosInstance";

export const postSignup = async (data : {name : string, email : string, password : string, bio?: string; avatar?: string;}) => {
    const response = await axiosInstance.post(`/auth/signup`, {
        name : data.name,
        email : data.email,
        password : data.password,
        bio : data.bio ?? null,
        avatar : data.avatar ?? null,
    });

    return response.data;
}

export const postSignin = async ( data : {email : string, password : string}) => {
    const response = await axiosInstance.post(`/auth/signin`, {
        email : data.email,
        password : data.password,
    });

    return response.data;
}

export const postSignout = async () => {
    const response = await axiosInstance.post(`/auth/signout`, {

    });

    return response.data;
}