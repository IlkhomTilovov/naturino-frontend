import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { authApi } from "../../../api/endpoints/auth";
import { Button } from "../../../components/ui/button";
import { loginSchema, type LoginFormValues } from "../../../lib/schemas/auth";
import { useAuthStore } from "../../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await authApi.login(values.email, values.password);
      setSession(result.user, result.accessToken, result.refreshToken);
      navigate("/admin", { replace: true });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setServerError("Email yoki parol noto'g'ri.");
      } else {
        setServerError("Tizimga kirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Parol</label>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          {...register("password")}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      {serverError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Kirilmoqda..." : "Kirish"}
      </Button>
    </form>
  );
}
