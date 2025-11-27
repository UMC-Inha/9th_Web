import { useDispatch } from 'react-redux';
import { openModal } from '../feature/modalSlice';
import { useCartStore } from '../hooks/useCartStore';

const Footer = () => {
    const openModal = useCartStore((state: { openModal: any; }) => state.openModal);

    return (
        <div className='flex justify-between bg-yellow-400 h-15'>
            <button 
                className='flex flex-1 font-bold text-[20px] text-white items-center justify-center '
                onClick={openModal}
            >
                전체 삭제
            </button>
        </div>
    )
}

export default Footer