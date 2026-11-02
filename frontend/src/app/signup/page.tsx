"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signupSchema, type SignupValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password") ?? "";
  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (values: SignupValues) => {
    const result = await signup(values.fullName, values.email);
    if (result.ok) router.push("/profile");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join CampusCart for student deals and easy ordering."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-lavender-700 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Aarav Sharma"
          leftIcon={<User size={18} />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
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
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password")}
        />

        <ul className="space-y-1.5">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-xs",
                rule.met ? "text-mint-600" : "text-ink-muted"
              )}
            >
              <Check size={14} strokeWidth={rule.met ? 3 : 1.5} />
              {rule.label}
            </li>
          ))}
        </ul>

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}