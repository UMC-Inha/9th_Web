import React from 'react'

const LpCardSkeleton = () => {
    return (
        <div className="w-45 h-45 gap-5">
            <div 
            className="relative group shadow-md cursor-pointer animate-pulse">
                <div className="relative group shadow-md cursor-pointer animate-pulse w-full h-full bg-gray-300 rounded-md" />
            </div>
        </div>
    )
}

export default LpCardSkeleton
