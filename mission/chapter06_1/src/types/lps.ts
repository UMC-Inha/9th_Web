export interface LpResponse {
    status : boolean,
    statusCode : number,
    message : string,
    data : Lp,
}

export interface Lp {
    data : LpData[],
    nextCursor : number,
    hasNext : boolean,
}

export interface LpData {
    id : number,
    title : string,
    content : string,
    thumbnail : string,
    published : boolean,
    authorId : number,
    createdAt : string,
    updatedAt : string,
    tags: { id: number; name: string }[];
    likes: { id: number; userId: number; lpId: number }[];
}