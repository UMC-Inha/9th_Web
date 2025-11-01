import { validateEmailOnly } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignin, postSignup } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import watermark from "../assets/메일.png";
import eyeOpen from "../assets/Eye open.svg";
import eyeClosed from "../assets/Eye hide.svg";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const {
    getInputProps,
    errors = {},
    touched,
    values,
  } = useForm<{
    email: string;
  }>({
    initialValue: {
      email: "",
    },
    validate: validateEmailOnly,
  });

  // pw
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // nickname
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  const validatePassword = (pwd: string, pwdCheck: string) => {
    if (pwd.length > 0 && pwd.length < 6)
      return "비밀번호는 6자 이상이어야합니다.";
    if (pwd.length > 20) return "비밀번호는 20자 이하로 입력해주세요.";
    if (pwdCheck && pwd !== pwdCheck) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const handleSubmitEmail = () => {
    if (!values.email || errors.email) return;
    setStep(2);
  };

  const handleSubmitPassword = () => {
    const msg = validatePassword(password, passwordCheck);
    if (msg) {
      setPasswordError(msg);
      return;
    }
    setPasswordError(""); // ← 추가
    setStep(3);
  };

  const handleSubmitNickname = async () => {
    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.trim().length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다.");
      return;
    }
    setNicknameError("");

    try {
      // 1) 회원가입
      await postSignup({
        email: values.email,
        password: password,
        name: nickname, // ← RequestSignupDto에 맞춘 부분
      });

      // 2) 바로 로그인
      const signinRes = await postSignin({
        email: values.email,
        password: password,
      });

      // 3) 토큰 저장
      setItem(signinRes.data.accessToken);

      // 4) 홈으로
      navigate("/");
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message ||
        "회원가입 중 알 수 없는 오류가 발생했습니다."; // ← 문구만 살짝 수정
      alert(errorMessage);
    }
  };

  const handleGoBack = () => {
    if (step === 3) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    navigate(-1);
  };

  const isEmailDisabled = !!errors?.email || values.email.trim() === "";
  const isPasswordDisabled =
    password.trim() === "" ||
    passwordCheck.trim() === "" ||
    password !== passwordCheck;
  const isNicknameDisabled = nickname.trim() === "";

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
          <h2 className="text-xl font-bold">회원가입</h2>
        </div>

        {/* step 1 */}
        {step === 1 && (
          <>
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 font-bold">
                OR
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <input
              {...getInputProps("email")}
              name="email"
              className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                ${
                  errors?.email && touched?.email
                    ? "border-pink-500 bg-pink-200"
                    : "border-gray-300"
                }`}
              type="email"
              placeholder="이메일을 입력해주세요"
            />
            {errors?.email && touched?.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <button
              type="button"
              onClick={handleSubmitEmail}
              disabled={isEmailDisabled}
              className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-gray-300"
            >
              다음
            </button>
          </>
        )}

        {/* step 2 */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-2 ">
              <img
                src={watermark}
                alt="메일 이미지"
                className="w-5 h-5 object-contain"
              />
              <span className="text-sm font-semibold">{values.email}</span>
            </div>

            {/* pw */}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => {
                  const newPwd = e.target.value;
                  setPassword(newPwd);
                  setPasswordError(validatePassword(newPwd, passwordCheck));
                }}
                type={showPassword ? "text" : "password"}
                className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm"
                placeholder="비밀번호를 입력해주세요!"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-300 hover:text-white"
              >
                <img
                  src={showPassword ? eyeOpen : eyeClosed}
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </div>

            {/* pw check */}
            <div className="relative">
              <input
                value={passwordCheck}
                onChange={(e) => {
                  const newCheck = e.target.value;
                  setPasswordCheck(newCheck);
                  setPasswordError(validatePassword(password, newCheck));
                }}
                type={showPasswordCheck ? "text" : "password"}
                className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm"
                placeholder="비밀번호를 다시 한 번 입력해주세요!"
              />
              <button
                type="button"
                onClick={() => setShowPasswordCheck((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-300 hover:text-white"
              >
                <img
                  src={showPasswordCheck ? eyeOpen : eyeClosed}
                  className="w-5 h-5 cursor-pointer"
                />
              </button>
            </div>

            {passwordError && (
              <div className="text-pink-400 text-sm">{passwordError}</div>
            )}

            <button
              type="button"
              onClick={handleSubmitPassword}
              disabled={isPasswordDisabled}
              className="w-full bg-pink-600 text-white py-3  rounded-md text-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 cursor-pointer"
            >
              다음
            </button>
          </>
        )}

        {/* step 3 */}
        {step === 3 && (
          <>
            <div className="flex flex-col items-center gap-4 mb-2">
              <div className="w-28 h-28 rounded-full bg-gray-200" />
            </div>

            <input
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (e.target.value.trim()) {
                  setNicknameError("");
                }
              }}
              className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm"
              placeholder="닉네임을 입력해주세요"
            />
            {nicknameError && (
              <div className="text-pink-400 text-sm">{nicknameError}</div>
            )}

            <button
              type="button"
              onClick={handleSubmitNickname}
              disabled={isNicknameDisabled}
              className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 cursor-pointer"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
