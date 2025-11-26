export interface UserResponse{
    status : boolean,
    statusCode : number,
    message : string,
    data : User
}

export interface User {
    id : number,
    name : string,
    email : string,
    bio : string,
    avatar : string,
    createdAt : string,
    updatedAt : string
}