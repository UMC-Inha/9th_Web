import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className='flex w-full h-15 bg-pink-300 justify-between items-center text-center'>
            <p className='flex flex-1 pl-5 text-[30px] font-bold'>
                CHICHI's LP SITE
            </p>

            <div className='flex gap-5 font-bold text-center h-10 pr-5 '>
                <button 
                className='bg-pink-500 w-20 rounded-md transition duration-300 hover:bg-pink-600 hover:scale-105'
                onClick={() => navigate('/login')}>
                    로그인
                </button>
                <button 
                className='bg-black w-20 text-pink-500 rounded-md transition duration-300 hover:bg-gray-800 hover:scale-105'
                onClick={() => navigate('/signin')}>
                    회원가입
                </button>
            </div>
        </nav>
    )
}

export default Navbar
