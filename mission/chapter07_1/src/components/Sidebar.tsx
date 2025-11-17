import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import ConfirmModal from './ConfirmModal';
import { deleteUser } from '../apis/auth';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { signout, setUserId, setName } = useAuth();

    const handleFullLogout = () => {
        signout();
        setUserId(null);
        setName(null);
    };

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
        alert('회원 탈퇴가 완료되었습니다.');

        handleFullLogout();
        },
        onError: (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');

            handleFullLogout();
        } else {
            console.error('탈퇴 실패:', error);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
            setIsModalOpen(false);
        }
        },
    });

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteMutation.mutate();
    };

    return (
        <>
        <aside className="relative flex flex-col w-full h-full bg-pink-400">
            <div className="flex-1 flex flex-col items-center gap-5 text-[22px] font-bold pt-5">
            <button onClick={() => navigate('/user')}>마이페이지</button>

            <button onClick={() => navigate('/lp')}>LP 페이지</button>

            <button className="flex w-20 gap-2 items-center justify-center">
                <FaSearch size={18} />
                <p> 검색 </p>
            </button>

            <button
                onClick={handleDeleteClick}
                className="mt-90 bg-black text-pink-500 text-[18px] w-22 h-10 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105"
            >
                탈퇴하기
            </button>
            </div>
        </aside>

        <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmDelete}
            isPending={deleteMutation.isPending}
            title="회원 탈퇴"
        >
            정말로 탈퇴 하시겠습니까?
        </ConfirmModal>
        </>
    );
};

export default Sidebar;