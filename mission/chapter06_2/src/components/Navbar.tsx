import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarRef: React.RefObject<HTMLDivElement>;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen, sidebarRef, buttonRef }) => {
    const navigate = useNavigate();
    const { signout, accessToken, name } = useAuth();
    const isLogin = !!accessToken;

    const handleSignout = async () => {
        try {
            await signout();

            alert ('로그아웃이 완료되었습니다.');

            navigate('/');
        }

        catch (error) {
            let message = "알 수 없는 에러가 발생하였습니다 !";

            if (error instanceof Error) {
                message = error.message;
            }

            alert(message);
        }
    };

    return (
        <nav className='fixed flex w-full h-16 bg-pink-300 justify-between items-center text-center'>
            <div className="inset-0 flex flex-1 gap-5 pl-5">
                <button 
                    ref={buttonRef} 
                    className="hidden md:block text-[30px] font-bold"
                    onClick={() => setIsOpen((prev) => !prev)} 
                >
                    {isOpen ? "♡" : "♥"} 
                </button>
                <p className='text-[30px] font-bold'>
                    CHICHI's LP SITE
                </p>
            </div>

            <div 
                ref={sidebarRef} 
                className={`fixed top-16 left-0 h-full w-64 bg-pink-200 z-50 transform transition-transform duration-300 ease-in-out hidden md:block ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Sidebar />
            </div>

            {isOpen && ( 
                <div className="fixed inset-0 z-40 hidden md:block"></div>
            )}

            {!isLogin && 
                <div className='flex gap-5 font-bold text-center h-10 pr-5 '>
                    <button 
                    className='bg-pink-500 w-22 rounded-md transition duration-300 hover:bg-pink-600 hover:scale-105'
                    onClick={() => navigate('/login')}>
                        로그인
                    </button>

                    <button 
                    className='bg-black w-22 text-pink-500 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105'
                    onClick={() => navigate('/signin')}>
                        회원가입
                    </button>
                </div>
            }   
            {isLogin && 
                <div className='flex gap-5 font-bold justify-center text-center h-10 pr-5 '>
                    <p className='text-black text-[20px] p-1'>
                        ʚ {name} 님 ɞ
                    </p>

                    <button className='bg-pink-500 w-22 rounded-md transition duration-300 hover:bg-pink-600 hover:scale-105'
                    onClick={handleSignout}>
                        로그아웃
                    </button>

                    <button 
                    className='bg-black w-22 text-pink-500 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105'
                    onClick={() => navigate('/user')}>
                        마이페이지
                    </button>
                </div>
            }
        </nav>
    );
}

export default Navbar;