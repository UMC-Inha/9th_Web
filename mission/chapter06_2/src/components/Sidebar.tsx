import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className='relative flex flex-col w-full h-full bg-pink-400'>
            <div className='flex-1 flex flex-col items-center gap-5 text-[22px] font-bold pt-5'>
                <button
                onClick={() => navigate('/user')}>
                    마이페이지
                </button>

                <button
                onClick={() => navigate('/lp')}>
                    LP 페이지
                </button>

                <button>
                    <div className='flex flex-1 w-20 gap-2 items-center justify-center'>
                        <FaSearch size={18} />
                        <p> 검색 </p>
                    </div>

                    <button
                    className='mt-90 bg-black text-pink-500 text-[18px] w-22 h-10 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105'>
                        탈퇴하기
                    </button>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;