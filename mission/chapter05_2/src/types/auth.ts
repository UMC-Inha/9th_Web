export interface Signup {
    id : number,
    name : string,
    email : string,
    bio : null,
    avatar : null,
    createdAt : string,
    updatedAt : string,
}

export interface SignupResponse {
    status : boolean,
    statusCode : number,
    message : string,
    data : Signup[]
}

export interface Signin {
    id : number,
    name : string,
    accessToken : string,
    refreshToken : string
}

export interface SigninResponse {
    status : boolean,
    statusCode : number,
    message : string,
    data : Signin[]
}