import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import { useNavigate } from "react-router-dom";

interface SignUpForm {
  email: string;
  username: string;
  password: string;
  agree: boolean;
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({
    mode: "onChange",
  });

  const onSubmit = (data: SignUpForm) => {
    console.log(" 회원가입 요청 데이터:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="bg-white w-[420px] rounded-2xl p-10 shadow-lg">
        <h2 className="text-center text-xl font-semibold">Create an Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Create an account to continue
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            placeholder="example@gmail.com"
            error={errors.email}
            {...register("email", {
              required: "이메일은 필수입니다.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "유효한 이메일 형식이 아닙니다.",
              },
            })}
          />

          <Input
            label="Username"
            placeholder="Username"
            error={errors.username}
            {...register("username", {
              required: "닉네임은 필수입니다.",
              minLength: { value: 2, message: "2자 이상 입력해주세요." },
              maxLength: { value: 9, message: "9자 이하만 가능합니다." },
              pattern: {
                value: /^[A-Za-z가-힣]+$/,
                message: "영문 또는 한글만 가능합니다.",
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register("password", {
              required: "비밀번호는 필수입니다.",
              minLength: { value: 8, message: "8자 이상 입력해주세요." },
            })}
          />

          <Checkbox
            label="I accept terms and conditions"
            {...register("agree", {
              required: "이용 약관에 동의해야 합니다.",
            })}
          />
          {errors.agree && (
            <p className="text-red-500 text-sm">{errors.agree.message}</p>
          )}

          <Button disabled={!isValid}>Sign Up</Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
