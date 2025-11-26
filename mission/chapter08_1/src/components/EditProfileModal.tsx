import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { patchUsers } from "../apis/user";
import { User } from "../types/users";
import { useAuth } from "../contexts/AuthContext";

interface Props {
    user: User;
    onClose: () => void;
}

const EditProfileModal = ({ user, onClose }: Props) => {
    const queryClient = useQueryClient();
    const { setName: setAuthName } = useAuth();

    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || "");
    const [avatar, setAvatar] = useState(user.avatar || "");

    const { mutate, isPending } = useMutation({
        mutationFn: (newData: { name: string; bio: string | null; avatar: string | null }) => patchUsers(newData),
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ["user"] });

            const previousUser = queryClient.getQueryData<User>(["user"]);

            queryClient.setQueryData(["user"], (old: User | undefined) => ({
                ...old!,
                ...newData,
            }));

            if (newData.name) {
                setAuthName(newData.name);
            }

            return { previousUser };
        },

        onError: (_, __, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(["user"], context.previousUser);
                setAuthName(context.previousUser.name);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },

        onSuccess: () => {
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
            <div className="bg-black border-2 border-pink-400 rounded-2xl w-[420px] shadow-xl overflow-hidden">
                <div className="bg-pink-400 text-black font-bold text-xl px-4 py-3 flex justify-between items-center">
                    <span>프로필 수정</span>
                    <button onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 text-white flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-pink-400"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-pink-300">이름</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg bg-black border border-pink-400 text-white"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-pink-300">Bio (옵션)</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg bg-black border border-pink-400 text-white"
                            placeholder="비워도 저장됩니다"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-pink-300">
                            프로필 이미지 URL (옵션)
                        </label>
                        <input
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full mt-1 p-2 rounded-lg bg-black border border-pink-400 text-white"
                            placeholder="비워도 저장됩니다"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 bg-black px-6 py-4 border-t border-pink-400">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-300 text-black font-semibold hover:bg-gray-400"
                    >
                        취소
                    </button>

                    <button
                        onClick={() =>
                            mutate({
                                name,
                                bio: bio.trim() === "" ? null : bio,
                                avatar: avatar.trim() === "" ? null : avatar,
                            })
                        }
                        disabled={isPending || !name}
                        className="px-5 py-2 rounded-xl bg-pink-400 text-black font-bold hover:bg-pink-500 disabled:opacity-50"
                    >
                        {isPending ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
