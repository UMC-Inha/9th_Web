import { FaCartShopping } from 'react-icons/fa6';
import { useCartStore } from '../hooks/useCartStore';


const Navbar = () => {
    const amount = useCartStore((state: { amount: any; }) => state.amount);

    return (
        <nav className='flex justify-between bg-yellow-400 h-15'>
            <div className="flex text-center items-center font-bold p-4 text-[25px] text-white">
                CHICHI's STORE
            </div>
            <div className='flex gap-4 text-center items-center font-bold p-4 text-[25px] text-white'>
                <FaCartShopping style={{ fontSize: '30px', color: 'white' }} />
                <span className='relative'>
                    <div>
                        {amount}
                    </div>
                </span>
            </div>
        </nav>
    )
}

export default Navbar