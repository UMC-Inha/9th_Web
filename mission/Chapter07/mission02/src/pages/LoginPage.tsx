import BackPageButton from "../components/BackPageButton";
import { useLogin } from "../hooks/mutations/useLogin";
import useForm from "../hooks/useForm";
import { type UserSigninInformatin, validateSignin } from "../utils/validate";
import type { FormEvent } from "react";

const LoginPage = () => {

  const { values, error, touch, getInputProps } = useForm<UserSigninInformatin>(
    {
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    }
  );

  const {
    mutate: loginMutate,
    isPending,
    authError,
  } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutate(values);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + `/v1/auth/google/login`;
  };

  const isFormInvalid =
    Object.values(error || {}).some((error) => error.length > 0) ||
    Object.values(values).some((values) => values === "");
  
  const isButtonDisabled = isFormInvalid || isPending;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center mb-5">
          <div>
            <BackPageButton />
          </div>
          <div className="flex-1 text-center font-semibold text-xl text-white">
            로그인
          </div>
          <div className="flex-none w-6"></div>
        </div>

        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
          ${
            error?.email && touch?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type={"email"}
          placeholder="이메일"
        />
        {error?.email && touch?.email && (
          <div className="text-red-500 text-sm">{error.email}</div>
        )}

        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-2 rounded-sm focus:border-[#807bff]
          ${
            error?.password && touch?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-300"
          }`}
          type={"password"}
          placeholder="비밀번호"
        />
        {error?.password && touch?.password && (
          <div className="text-red-500 text-sm">{error.password}</div>
        )}

        {authError && (
          <div className="text-red-500 text-sm text-center">{authError}</div>
        )}

        <button
          type={"submit"}
          disabled={isButtonDisabled} 
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>

        <button
          type={"button"}
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium transition-colors hover:bg-blue-700 cursor-pointer disabled:bg-gray-300"
        >
          <div className="flex items-center justify-center gap-1">
            <img src={"/google.png"} alt="구글 로고" className="size-7" />
            <span>구글 로그인</span>
          </div>
        </button>
      </form>
    </div>
  );
};

export default LoginPage;