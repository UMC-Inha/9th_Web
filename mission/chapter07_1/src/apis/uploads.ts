import { axiosInstance } from "./axiosInstance";

export const postImage = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.data.imageUrl;
}