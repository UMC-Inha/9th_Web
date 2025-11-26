// Sidebar.tsx — UI만 담당하는 컴포넌트
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import { deleteUser } from "../apis/auth";
import { useAuth } from "../contexts/AuthContext";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { signout, setUserId, setName } = useAuth();

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            alert("회원 탈퇴가 완료되었습니다.");

            signout();

            setUserId(null);
            setName(null);

            navigate("/");
        },

        onError: (error: unknown) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");

                signout();

                navigate("/");
            } 
        
            else {
                console.error("탈퇴 실패:", error);

                alert("회원 탈퇴 중 오류가 발생했습니다.");
            }
        },
    });

    const handleConfirmDelete = () => deleteMutation.mutate();

    return (
        <>
            <div className="flex flex-col h-full p-5">
                <nav className="flex flex-col gap-5 text-[20px] font-bold">
                    <button onClick={() => navigate("/user")}> 마이페이지 </button>

                    <button onClick={() => navigate("/lp")}> LP 페이지 </button>

                    <button className="flex gap-2 justify-center items-center">
                        <FaSearch size={18} /> 검색
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-pink-500 text-[18px] ml-13 mr-13 mt-90 h-10 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105"
                    >
                        탈퇴하기
                    </button>
                </nav>
            </div>

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
