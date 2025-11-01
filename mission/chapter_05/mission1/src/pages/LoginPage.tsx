import type { UserSigninInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
  const navigate = useNavigate(); //페이지 이동 훅

  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  //useForm 훅에서 필요한 값들을 구조분해 할당
  const { getInputProps, errors, touched, values } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
    let response;
    try {
      response = await postSignin(values);
      setItem(response.data.accessToken);

      navigate("/"); //로그인 성공 시 HomePage로 이동
    } catch (error) {
      //에러 메시지 처리를 더 안전하게 변경
      const errorMessage =
        (error as { message?: string })?.message ||
        "로그인 중 알 수 없는 오류가 발생했습니다.";
      alert(errorMessage);
    }

    console.log(response);
  };

  //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true

  const handleGoBack = () => {
    navigate(-1); //바로 이전 페이지로 돌아감
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

        <button className="w-full border border-gray-400 py rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <img src="google-icon.png" alt="Google" className="w-5 h-5" />
          <span>구글 로그인</span>
        </button>

        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 font-bold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <input
          {...getInputProps("email")}
          name="email" //name 속성은 getInputProps에서 처리되지 않을 경우 명시해주는 것이 좋음
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${
              errors?.email && touched?.email
                ? "border-pink-500 bg-pink-200"
                : "border-gray-300"
            }`}
          type={"email"}
          placeholder={"이메일을 입력해주세요"}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          name="password"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${
              errors?.password && touched?.password
                ? "border-pink-500 bg-pink-200"
                : "border-gray-300"
            }`}
          type={"password"}
          placeholder={"비밀번호를 입력해주세요"}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-pink-600 text-white py-3 rounded-md text-lg fond-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
