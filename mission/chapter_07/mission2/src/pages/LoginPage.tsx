import type { UserSigninInformation } from "../utils/validate.js";
import { validateSignin } from "../utils/validate.js";
import useForm from "../hooks/useForm.js";
import { useNavigate, useLocation } from "react-router-dom";
import watermark from "../assets/google.png";
import { useLoginMutation } from "../hooks/queries/useLoginMutation.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: loginMutate } = useLoginMutation();

  const { getInputProps, errors, touched, values } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  /** ⬇️ ⭐ useMutation 기반 로그인 */
  const handleSubmit = () => {
    loginMutate(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((e) => e.length > 0) ||
    Object.values(values).some((v) => v === "");

  const handleGoBack = () => navigate(-1);

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <div className="relative flex justify-center items-center mb-4">
          <button
            onClick={handleGoBack}
            className="absolute left-0 text-gray-600 cursor-pointer hover:text-gray-900 font-bold text-2xl"
          >
            &lt;
          </button>
          <h2 className="text-xl font-bold">로그인</h2>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 border border-gray-400 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <img src={watermark} alt="Google_logo" className="w-5 h-5" />
          <span>구글 로그인</span>
        </button>

        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="flex-shrink mx-4 text-gray-500 font-bold">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <input
          {...getInputProps("email")}
          className={`border w-[300px] p-[10px] rounded-sm ${
            errors?.email && touched?.email
              ? "border-pink-500 bg-pink-200"
              : "border-gray-300"
          }`}
          type="email"
          placeholder="이메일을 입력해주세요"
        />

        <input
          {...getInputProps("password")}
          className={`border w-[300px] p-[10px] rounded-sm ${
            errors?.password && touched?.password
              ? "border-pink-500 bg-pink-200"
              : "border-gray-300"
          }`}
          type="password"
          placeholder="비밀번호를 입력해주세요"
        />

        <button
          type="button"
          disabled={isDisabled}
          onClick={handleSubmit}
          className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
