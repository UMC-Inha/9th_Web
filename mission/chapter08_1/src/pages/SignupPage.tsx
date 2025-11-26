import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { SignupFormValues, signupSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postSignup } from "../apis/auth";
import { email } from "zod";
import { da } from "zod/v4/locales";

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        trigger,
        watch,
        formState: { errors, isValid, touchedFields } 
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onTouched"
    });
    
    const passwordValue = watch("password");

    const handleNextStep = async () => {
        let isValidStep = false;
        if (step === 1) {
            isValidStep = await trigger("email");
        } 
        
        else if (step === 2) {
            isValidStep = await trigger(["password", "passwordCheck"]);
        }

        if (isValidStep) {
            setStep(prev => prev + 1);
        }
    };

    const handleSignup : SubmitHandler<SignupFormValues> = async (data) => {
        try {
            const response = await postSignup({
                email : data.email,
                password : data.password,
                name : data.name,
            });

            if (response.accessToken) {
                setAccessToken(response.accessToken);
            }

            alert ('회원가입이 완료되었습니다.');
            navigate('/');
        }

        catch (error : any) {
            console.log(error);

            alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        }
    };
    
    return (
        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col w-full h-dvh bg-black items-center text-center justify-center gap-5">
            <div className="flex gap-12 pr-20">
                <button type="button" className="text-white text-[30px] font-bold text-center cursor-pointer transition duration-300 hover:text-gray-500"
                onClick={() => {
                    if (step === 1) navigate(-1);
                    else setStep(prev => prev - 1);
                }}>
                    ←
                </button>
                <h1 className="text-white text-[35px] font-bold">SIGNUP PAGE</h1>
            </div>

            {step === 1 && (
                <div className="flex flex-col gap-5">
                    <div className="flex border border-pink-500 border-1 w-70 h-13 text-center items-center font-bold text-white justify-center rounded-xl">
                        구글 로그인
                    </div>

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

                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={!!errors.email || !touchedFields.email}
                            className={`flex text-white w-70 h-13 text-center justify-center items-center font-bold cursor-pointer rounded-xl transition duration-300 ${(!errors.email && touchedFields.email) ? "bg-pink-500 hover:bg-pink-800" : "bg-gray-500"}`}>
                            다음
                        </button>
                    </div>
                </div>
            )} 
            
            {step === 2 && (
                <div className="flex flex-col gap-5">
                    <div className="flex text-white text-[20px] font-bold w-70 h-13 text-center items-center justify-center">
                        ✉️ {watch("email")}
                    </div>
                    <div className="relative w-70">
                        <input
                            className="flex text-white w-70 h-13 pl-12 pr-12 border border-pink-500 border-1 text-center rounded-xl"
                            placeholder="비밀번호를 입력하세요" 
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "비밀번호를 입력해 주세요.",
                                minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." }
                            })}
                        />
                        
                        <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 px-4 text-white">
                            {showPassword ? "🖤" : "🤍"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-sm">
                            {errors.password.message}
                        </p>
                    )}

                    <div className="relative w-70">
                        <input
                            className="flex text-white w-70 h-13 border border-pink-500 border-1 text-center rounded-xl"
                            placeholder="비밀번호를 다시 한 번 입력하세요" 
                            type={showPasswordCheck ? "text" : "password"}
                            {...register("passwordCheck", {
                                required: "비밀번호 확인을 입력해 주세요.",
                                validate: value => value === passwordValue || "비밀번호가 일치하지 않습니다."
                            })}
                        />
                        <button 
                        type="button" 
                        onClick={() => setShowPasswordCheck(!showPasswordCheck)} 
                        className="absolute inset-y-0 right-0 px-4 text-white">
                            {showPasswordCheck ? "🖤" : "🤍"}
                        </button>
                    </div>

                    {errors.passwordCheck && <p className="text-red-400 text-sm"> {errors.passwordCheck.message} </p>}

                    <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!!errors.password || !!errors.passwordCheck}
                        className={`flex text-white w-70 h-13 text-center justify-center items-center font-bold cursor-pointer rounded-xl transition duration-300 ${(!errors.password && !errors.passwordCheck && touchedFields.password && touchedFields.passwordCheck) ? "bg-pink-500 hover:bg-pink-800" : "bg-gray-500"}`}>
                        다음
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-5">
                    <div className="flex justify-center">
                        <img
                            src="https://i.namu.wiki/i/Bge3xnYd4kRe_IKbm2uqxlhQJij2SngwNssjpjaOyOqoRhQlNwLrR2ZiK-JWJ2b99RGcSxDaZ2UCI7fiv4IDDQ.webp"
                            alt="profile"
                            className="w-40 h-40 rounded-full object-cover border-2 border-pink-500"
                        />
                    </div>
                    <input
                        className="flex text-white w-70 h-13 border border-pink-500 border-1 text-center rounded-xl"
                        placeholder="닉네임을 입력하세요" 
                        {...register("name", { required: "닉네임을 입력해 주세요." })}
                    />
                    
                    {errors.name && (
                        <p className="text-red-400 text-sm">
                            {errors.name.message}
                        </p>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`flex text-white w-70 h-13 text-center justify-center items-center font-bold cursor-pointer rounded-xl transition duration-300 ${isValid ? "bg-pink-500 hover:bg-pink-800" : "bg-gray-500"}`}>
                        회원가입 완료
                    </button>
                </div>
            )}
        </form>
    )
}

export default SignupPage;