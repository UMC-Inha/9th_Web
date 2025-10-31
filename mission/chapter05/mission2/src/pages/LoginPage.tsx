import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../schemas/auth";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await api.post("/auth/login", values);

      const { access_token, refresh_token } = res.data;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      login(access_token);

      nav("/");
    } catch (err: any) {
      console.error(err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-black text-white flex items-start justify-center"
    >
      <div className="w-full max-w-sm mx-auto mt-16 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold">로그인</h1>
        </div>

        <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/40 p-4">
          <input
            {...register("email")}
            placeholder="이메일"
            type="email"
            autoComplete="email"
            className={`w-full bg-transparent border rounded-lg px-3 py-2 outline-none
            ${
              errors.email && touchedFields.email
                ? "border-red-500"
                : "border-zinc-600 focus:border-zinc-300"
            }`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            placeholder="비밀번호"
            type="password"
            autoComplete="current-password"
            className={`mt-4 w-full bg-transparent border rounded-lg px-3 py-2 outline-none
            ${
              errors.password && touchedFields.password
                ? "border-red-500"
                : "border-zinc-600 focus:border-zinc-300"
            }`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-6 w-full rounded-lg py-2 bg-pink-600 hover:bg-pink-500 transition disabled:bg-zinc-800 disabled:text-zinc-400"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
}
