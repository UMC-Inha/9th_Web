export interface LpCommentsResponse {
    status : boolean,
    statusCode : number,
    message : string,
    data : LpComments[],
}

export interface LpComments {
    data : LpCommentsData[],
    nextCursor : number,
    hasNext : boolean
}

export interface LpCommentsData {
    id : number,
    content : string,
    lpId : number,
    authorId : number,
    createdAt : string,
    updatedAt : string,
    author : {
        id : number,
        name : string,
        email : string,
        bio : null,
        avatar : null,
        createdAt : string,
        updatedAt : string,
    }
}