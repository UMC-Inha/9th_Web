import React from 'react'

const LpCardSkeleton = () => {
    return (
        <div className="w-45 h-45 gap-5">
            <div 
            className="relative group shadow-md cursor-pointer animate-pulse">
                <div className="w-full h-full object-cover bg-gray-300"> </div>
            </div>
        </div>
    )
}

export default LpCardSkeleton
