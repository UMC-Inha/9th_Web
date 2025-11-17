import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { deleteLikes, getLpDetail, postLikes } from "../apis/lps";
import { patchLp } from "../apis/lps";
import { useAuth } from "../contexts/AuthContext";

const LpDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const lpId = Number(id);
    const { name } = useAuth();
    const { userId } = useAuth();

    const { data: lpData, isLoading, isError } = useQuery({
        queryKey: ["lpDetail", lpId],
        queryFn: () => getLpDetail(lpId),
        enabled: !isNaN(lpId) && lpId > 0,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [published, setPublished] = useState(false);

    const { mutate: updateLp, isPending: saving } = useMutation({
        mutationFn: () =>
            patchLp(lpId, {
                title,
                content,
                thumbnail,
                tags,
                published,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpDetail", lpId] });
            setIsEditing(false);
        },
    });

    const { mutate: toggleLike, isPending: likePending } = useMutation({
        mutationFn: () =>
            isLiked ? deleteLikes(lpId) : postLikes(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpDetail", lpId] });
        },
    });

    if (isLoading) return <div>로딩 중...</div>;
    if (isError) return <div className="flex h-screen w-full items-center justify-center bg-red-500 text-white text-2xl">에러</div>;

    const lp = lpData?.data;

    const isLiked = lp.likes.some((l: any) => l.userId === userId);

    const startEdit = () => {
        setIsEditing(true);
        setTitle(lp.title);
        setContent(lp.content);
        setThumbnail(lp.thumbnail);
        setTags(lp.tags.map((t: any) => t.name));
        setPublished(lp.published);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-black text-2xl">
            <div className="mt-15 h-150 w-150 justify-center items-center border border-pink-300 bg-pink-300 rounded-lg">
                <div className="flex flex-col p-5 gap-2 text-[22px] font-bold">
                    <div className="flex flex-1 text-[18px] justify-between">
                        <p>{name}</p>
                        <p className="font-semibold text-[15px]">{new Date(lp.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-1 justify-between">
                        {isEditing ? (
                            <input
                                className="focus:outline-none w-70 p-1 rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        ) : (
                            <p>{lp.title}</p>
                        )}

                        <div className="flex right-0 gap-3 font-bold">
                            <button onClick={isEditing ? () => updateLp() : startEdit}>
                                {isEditing ? "✔" : "✐"}
                            </button>
                            <button>☠︎</button>
                        </div>
                    </div>

                    <div className="flex flex-col ml-20 mr-20 items-center justify-center gap-2">
                        <div className="flex w-100 h-100 items-center justify-center border border-pink-300 shadow-2xl">
                            {isEditing ? (
                                <input
                                    className="focus:outline-none w-80 p-1 rounded"
                                    value={thumbnail}
                                    onChange={(e) => setThumbnail(e.target.value)}
                                />
                            ) : (
                                <img
                                    src={lp.thumbnail}
                                    className="w-80 h-80 items-center justify-center rounded-full"
                                    alt={lp.title}
                                />
                            )}
                        </div>

                        {isEditing ? (
                            <textarea
                                className="text-center focus:outline-none w-80 h-5 text-sm rounded text-black"
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        ) : (
                            <p className="text-[13px]">{lp.content}</p>
                        )}

                        <div>
                            {isEditing ? (
                                <input
                                    className="text-center focus:outline-none rounded text-sm  w-80 h-5 text-black"
                                    value={tags.join(", ")}
                                    onChange={(e) => setTags(e.target.value.split(",").map(t => t.trim()))}
                                />
                            ) : (
                                lp.tags.slice(0, 3).map((tag: any) => (
                                    <span
                                        key={tag.id}
                                        className="inline-block bg-white text-pink-700 text-[12px] font-semibold px-3 py-1 ml-2 mr-2 rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))
                            )}
                        </div>

                        <div className="flex gap-50 justify-between">
                            <button
                                className={`text-[18px] ${isLiked ? "text-red-600" : "text-black"}`}
                                disabled={likePending}
                                onClick={() => toggleLike()}
                            >
                                ♥ {lpData.data.likes.length}
                            </button>
                            <button className="text-[16px] text-black rounded-sm w-12 h-6 font-bold" onClick={() => navigate("comment")}>댓글</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LpDetailPage;