import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormValues, loginSchema } from "../schema";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    // const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
    const { signin, accessToken } = useAuth();

    const {
        register, 
        handleSubmit, 
        formState: { errors, isValid } 
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), 
        mode: "onTouched"
    });

    const navigate = useNavigate();

    /*
    const handleInputEmail = (e : React.FormEvent) => {
        e.preventDefault();

        setEmailTouch(true);
    }
    
    const handleInputPassword = (e : React.FormEvent) => {
        e.preventDefault();

        setPasswordTouch(true);
    }
    */

    useEffect(() => {
        if (accessToken) {
            alert('이미 로그인 되어 있습니다 !');

            navigate('/', { replace : true });
        }
    }, [navigate])

    const handleSignin : SubmitHandler<LoginFormValues> = async (data) => {
        try {
            /*
            const response = await postSignin({
                email : data.email,
                password : data.password,
            });

            if (response.accessToken && response.refreshToken) {
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken ?? "");
            }
            */

            await signin(data.email, data.password);

            alert ('로그인이 완료되었습니다.');
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

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/v1/auth/google/login";
    };

    return (
        <form
        className="flex flex-col w-full h-dvh bg-black items-center text-center justify-center gap-5"
        onSubmit={handleSubmit(handleSignin)}>

            <div className="flex flex-col w-full h-dvh bg-black items-center text-center justify-center gap-5">
                <div className="flex gap-12 pr-20">
                    <button 
                    className="text-white text-[30px] font-bold text-center cursor-pointer transition duration-300 hover:text-gray-500"
                    onClick={() => navigate(-1)}>
                        ←
                    </button>

                    <h1 className="text-white text-[35px] font-bold">
                        LOGIN PAGE
                    </h1>
                </div>

                <button 
                className="flex border border-pink-500 border-1 w-70 h-13 text-center items-center font-bold text-white justify-center rounded-xl"
                onClick={handleGoogleLogin}
                >
                    구글 로그인
                </button>

                <div className="flex gap-2">
                    <hr className="text-white w-30 mt-3"/>
                    <p className="text-white text-center font-bold"> OR </p>
                    <hr className="text-white w-30 mt-3"/>
                </div>

                <div className="flex flex-col gap-5">
                    <input
                    className="flex text-white w-70 h-13 border border-pink-500 border-1 text-center rounded-xl"
                    placeholder="이메일을 입력하세요" 
                    {...register("email", {
                        required: "이메일을 입력해 주세요.",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "올바른 이메일 형식이 아닙니다."
                        }
                    })}
                    />

                    {errors.email && (
                        <p className="text-red-400 text-sm">
                            {errors.email.message}
                        </p>
                    )}

                    <input
                    className="flex text-white w-70 h-13 border border-pink-500 border-1 text-center rounded-xl"
                    placeholder="비밀번호를 입력하세요" 
                    type="password"
                    {...register("password", {
                        required: "비밀번호를 입력해 주세요.",
                        minLength: {
                            value: 8,
                            message: "비밀번호는 8자 이상이어야 합니다."
                        }
                    })}
                    />

                    {errors.password && (
                        <p className="text-red-400 text-sm">
                            {errors.password.message}
                        </p>
                    )}

                    <button
                    className={`flex text-white w-70 h-13 text-center justify-center items-center font-bold cursor-pointer rounded-xl transition duration-300 hover:bg-pink-800 ${isValid ? "bg-pink-500 hover:bg-pink-800" : "bg-gray-500"}`}
                    type="submit"
                    disabled={!isValid}>
                        로그인
                    </button>
                </div>
            </div>
        </form>
    )
}

export default LoginPage

