export interface LpResponse {
    title: string;
    content: string;
    thumbnail: string;
    tags: any;
    published: boolean;
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

export interface LpLikesResponse {
    status : boolean,
    statusCode : number,
    message : string,
    data : LpLikes,
}

export interface LpLikes {
    id : number,
    userId : number,
    lpId : number
}