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
    const response = await axiosInstance.post(`/auth/signin`, data);

    return response.data.data;
}

export const postSignout = async () => {
    const response = await axiosInstance.post(`/auth/signout`, {

    });

    return response.data;
}

export const getGoogleLogin = async () => {
    const response = await axiosInstance.get(`/auth/google/login`, {

    });

    return response.data;
}

export const getGoogleCallback = async () => {
    const response = await axiosInstance.get(`/auth/google/callback`, {

    });

    return response.data;
}

export const getProtected = async () => {
    const response = await axiosInstance.get(`/auth/protected`, {

    });

    return response.data;
}

export const deleteUser = async () => {
    const response = await axiosInstance.delete(`/users`, {

    });

    return response.data;
}