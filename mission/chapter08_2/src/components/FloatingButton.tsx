import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import LpCreatedModal from "./LpCreatedModal";

const FloatingButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div>
            <div className='fixed p-3 bottom-15 right-0'>
                <button 
                onClick={handleOpenModal}
                className='flex justify-center text-center items-center font-bold text-white text-[20px] w-12 h-12 border border-pink-500 bg-pink-500 rounded-full'>
                    <FaPlus size={20} color="black" strokeWidth={2} strokeLinecap="square" />
                </button>
            </div>

            { isModalOpen && ( 
                <>
                    <LpCreatedModal isOpen={isModalOpen} onClose={handleCloseModal} />
                </>
            )}
        </div>
    )
}

export default FloatingButton
