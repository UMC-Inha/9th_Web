// components/LpCard.tsx
import React from "react";
import { LpData } from "../types/lps";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";

interface LpCardProps {
    lp: LpData;
}

const LpCard: React.FC<LpCardProps> = ({ lp }) => {
    const navigate = useNavigate();

    const uploadTime = formatDistanceToNowStrict(new Date(`${lp.createdAt}`), {
        addSuffix: true,
    });

    return (
        <div className="w-45 h-45 gap-5">
            <button 
            className="relative group shadow-md cursor-pointer"
            onClick={() => navigate(`/lp/${lp.id}`)}>
                <img 
                src={lp.thumbnail} 
                alt={lp.title} 
                className="w-full h-full object-cover group-hover:opacity-40 transition-opacity transition-transform duration-300 ease-in-out group-hover:scale-110"/>

                <div className="absolute inset-0 flex flex-col p-2 text-pink-400 opacity-0 translate-y-35 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-30">
                    <h3 className="flex left-0"> {lp.title} </h3>
                    <div className="flex flex-1 w-40 h-10 justify-between">
                        <p className="flex left-0 text-sm"> {uploadTime} </p>
                        <p className="flex text-sm"> ♥ {lp.likes.length} </p>
                    </div>
                </div>
            </button>
        </div>
    )
};

export default LpCard;


