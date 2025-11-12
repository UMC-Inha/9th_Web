import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLpDetail, getLps } from "../apis/lps";
import { useAuth } from "../contexts/AuthContext";

const LpDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { name } = useAuth();
    const navigate = useNavigate();

    const lpId = Number(id);

    const { data : lpData, isLoading, isError, error } = useQuery({
        queryKey : ['lpDetail', lpId],
        queryFn : () => getLpDetail(lpId),
        staleTime : 1000 * 60 * 5,
        gcTime : 1000 * 60 * 10,
        enabled : !isNaN(lpId) && lpId > 0,
    })
    
    if (isLoading) {
        return <div>로딩 중...</div>;
    }
    
    if (isError) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-red-500 text-white text-2xl">
                에러
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-black text-2xl">
            <div className="mt-15 h-150 w-150 justify-center items-center border border-pink-300 bg-pink-300 rounded-lg">
                <div className="flex flex-col p-5 gap-2 text-[22px] font-bold">
                    <div className="flex flex-1 text-[18px] justify-between">
                        <p className="">
                            {name}
                        </p>
                        
                        <p className="font-semibold text-[15px]">
                            {new Date(lpData?.data.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-1 justify-between">
                        <p className="">
                            {lpData?.data.title}
                        </p>

                        <div className="flex right-0 gap-3 font-bold">
                            <button
                            onClick={() => navigate(-1)}>
                                ✐
                            </button>

                            <button>
                                ☠︎
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col ml-20 mr-20 items-center justify-center gap-2">
                        <div className="flex w-100 h-100 items-center justify-center border border-pink-300 shadow-2xl">
                            <img
                            src={lpData?.data.thumbnail} 
                            className="w-80 h-80 items-center justify-center rounded-full"
                            alt={lpData?.data.title}/>
                        </div>
                        <p className="text-[15px]"> {lpData?.data.content} </p>
                        <div> 
                            {lpData?.data.tags?.slice(0, 3).map((tag) => (
                                <span
                                key={tag.id}
                                className="inline-block bg-white text-pink-700 text-[12px] font-semibold px-3 py-1 ml-2 mr-2 rounded-full"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex gap-50 justify-between">
                            <p className="text-[18px]"> ♥ {lpData?.data.likes.length} </p>
                            <button 
                            className='text-[16px] text-black rounded-sm w-12 h-6 font-bold'
                            onClick={() => navigate('comment')}>
                                댓글
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LpDetailPage
