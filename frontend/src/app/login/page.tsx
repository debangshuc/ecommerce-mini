"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    const result = await login(values.email, values.remember);
    if (!result.ok) {
      setFormError(result.error ?? "Could not log in. Please try again.");
      return;
    }
    router.push("/");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to track orders and checkout faster."
      footer={
        <>
          New to CampusCart?{" "}
          <Link href="/signup" className="font-semibold text-lavender-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line accent-lavender-600"
              {...register("remember")}
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setShowForgotNotice(true)}
            className="text-sm font-semibold text-lavender-700 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {showForgotNotice && (
          <p className="rounded-2xl bg-sky-100 px-4 py-3 text-sm text-ink-soft">
            Password reset isn&apos;t available in this demo. Any email with a
            6+ character password will log you in.
          </p>
        )}
        {formError && (
          <p role="alert" className="rounded-2xl bg-peach-100 px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-6 rounded-2xl bg-lavender-50 px-4 py-3 text-xs text-ink-soft">
        Demo login: use any valid email and any password with 6 or more
        characters.
      </p>
    </AuthShell>
  );
}