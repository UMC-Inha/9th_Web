import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
    const {accessToken, name} = useAuth();
    const isLogin = !!accessToken;

    return (
        <div className="flex h-dvh bg-black text-center justify-center items-center">
            {!isLogin &&
                <h1 className="text-pink-500 font-bold text-[60px]"> LP 페이지에 오신 걸 환영합니다 </h1>
            } 

            {isLogin &&
                <h1 className="text-pink-500 font-bold text-[80px]"> {name}님의 LP 페이지 </h1> 
            }
        </div>
    )
}

export default HomePage
