import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../apis/user";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
    const [open, setOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn: getUsers,
    });

    if (isLoading) return <div className="text-white p-4">Loading...</div>;
    if (isError) return <div className="text-white p-4">Error loading profile</div>;

    const user = data.data;

    return (
        <div className="flex flex-col w-full h-screen bg-black justify-center items-center text-white">
            <div className="flex items-center gap-5">
                <img
                src={user.avatar}
                alt="avatar"
                className="w-40 h-40 rounded-full object-cover border-2 border-pink-400"
                />

                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-pink-400">{user.name}</h2>
                    <p className="text-gray-300">{user.email}</p>
                </div>

                <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-pink-400 text-black rounded-xl font-semibold hover:bg-pink-500"
                >
                설정
                </button>
            </div>

            <div className="flex flex-col justify-center items-center mt-6 bg-black w-100 h-20 p-6 border border-pink-400 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Bio</h3>
                <p className="whitespace-pre-line font-bold"> {user.bio || "No bio yet."} </p>
            </div>

            {open && <EditProfileModal user={user} onClose={() => setOpen(false)} />}
        </div>
    );
};

export default ProfilePage;
