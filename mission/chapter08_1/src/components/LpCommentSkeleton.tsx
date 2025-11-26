import React from 'react';

const LpCommentSkeleton = () => {
    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow animate-pulse">
            <div className="flex justify-between items-center mb-1">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/6"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mt-2"></div>
        </div>
    );
};

export default LpCommentSkeleton;