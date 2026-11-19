"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isCollegeEmail } from "@/lib/student";
import { signupSchema, type SignupValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InterestPicker } from "@/components/ui/InterestPicker";
import { OtpInput } from "@/components/ui/OtpInput";
import { PasswordInput } from "@/components/ui/PasswordInput";

type Step = "details" | "otp" | "interests";

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Account" },
  { id: "otp", label: "Verify phone" },
  { id: "interests", label: "Interests" },
];

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 5;
const DEMO_OTP = "123456"; // frontend simulation only
const MIN_INTERESTS = 3;

const emptyDigits = (): string[] => Array.from({ length: OTP_LENGTH }, () => "");

function formatTimer(seconds: number): string {
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function Stepper({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Signup progress">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                done && "bg-mint-500 text-white",
                active && "bg-lavender-600 text-white",
                !done && !active && "bg-line text-ink-muted"
              )}
            >
              {done ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:block",
                active ? "text-ink" : "text-ink-muted"
              )}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<SignupValues | null>(null);

  // OTP state
  const [digits, setDigits] = useState<string[]>(emptyDigits());
  const [otpStatus, setOtpStatus] = useState<"idle" | "error" | "success">("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resendNotice, setResendNotice] = useState(false);

  // Interests state
  const [interests, setInterests] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") ?? "";
  const emailValue = watch("email") ?? "";
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());
  const collegeEmail = looksLikeEmail && isCollegeEmail(emailValue);

  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  // Resend countdown
  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, secondsLeft]);

  const maskedPhone = details
    ? `+91 ${details.phone.slice(0, 2)}••••••${details.phone.slice(-2)}`
    : "";

  const onDetailsSubmit = (values: SignupValues) => {
    setDetails(values);
    setDigits(emptyDigits());
    setOtpStatus("idle");
    setOtpMessage("");
    setAttempts(0);
    setResendNotice(false);
    setSecondsLeft(RESEND_SECONDS);
    setStep("otp");
  };

  const handleDigitsChange = (next: string[]) => {
    setDigits(next);
    if (otpStatus !== "idle") {
      setOtpStatus("idle");
      setOtpMessage("");
    }
  };

  const handleVerify = async () => {
    if (digits.some((d) => d === "")) {
      setOtpStatus("error");
      setOtpMessage(`Enter all ${OTP_LENGTH} digits of the code.`);
      return;
    }
    setVerifying(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setVerifying(false);

    if (digits.join("") === DEMO_OTP) {
      setOtpStatus("success");
      setOtpMessage("Phone number verified!");
      setTimeout(() => setStep("interests"), 900);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setOtpStatus("error");
    setOtpMessage(
      nextAttempts >= MAX_ATTEMPTS
        ? "Too many wrong attempts. Please request a new code."
        : `That code is incorrect. ${MAX_ATTEMPTS - nextAttempts} ${
            MAX_ATTEMPTS - nextAttempts === 1 ? "attempt" : "attempts"
          } left.`
    );
  };

  const handleResend = () => {
    setDigits(emptyDigits());
    setOtpStatus("idle");
    setOtpMessage("");
    setAttempts(0);
    setSecondsLeft(RESEND_SECONDS);
    setResendNotice(true);
  };

  const finish = async (chosen: string[]) => {
    if (!details) return;
    setCreating(true);
    await signup({
      fullName: details.fullName,
      email: details.email,
      phone: details.phone,
      interests: chosen,
    });
    router.push("/");
  };

  const titles: Record<Step, { title: string; subtitle: string }> = {
    details: {
      title: "Create your account",
      subtitle: "Join CampusCart for student deals and easy ordering.",
    },
    otp: {
      title: "Verify your phone",
      subtitle: `We sent a ${OTP_LENGTH}-digit code to ${maskedPhone}.`,
    },
    interests: {
      title: "What are you into?",
      subtitle:
        "Pick a few interests and we'll tune your feed. You can change them any time in your profile.",
    },
  };

  const footer =
    step === "details" ? (
      <>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-lavender-700 hover:underline">
          Log in
        </Link>
      </>
    ) : step === "otp" ? (
      <>
        Wrong number?{" "}
        <button
          type="button"
          onClick={() => setStep("details")}
          className="font-semibold text-lavender-700 hover:underline"
        >
          Go back and edit
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={() => finish([])}
        disabled={creating}
        className="font-semibold text-lavender-700 hover:underline disabled:opacity-50"
      >
        Skip for now
      </button>
    );

  return (
    <AuthShell
      title={titles[step].title}
      subtitle={titles[step].subtitle}
      footer={footer}
    >
      <Stepper current={step} />

      {/* ---------- Step 1: details ---------- */}
      {step === "details" && (
        <form
          onSubmit={handleSubmit(onDetailsSubmit)}
          noValidate
          className="space-y-5"
        >
          <Input
            label="Full name"
            autoComplete="name"
            placeholder="Aarav Sharma"
            leftIcon={<User size={18} />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <div>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register("email")}
            />
            {!errors.email && collegeEmail && (
              <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-mint-600">
                <GraduationCap size={16} /> College email detected: you&apos;ll
                get student prices.
              </p>
            )}
            {!errors.email && !collegeEmail && (
              <p className="mt-2 text-xs text-ink-muted">
                Tip: use your college email (.edu, .ac.in) to unlock student
                prices. Personal emails see regular prices.
              </p>
            )}
          </div>

          <Input
            label="Phone number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            maxLength={10}
            leftIcon={<Phone size={18} />}
            hint="We'll send a verification code to this number."
            error={errors.phone?.message}
            {...register("phone")}
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
            Continue
          </Button>
        </form>
      )}

      {/* ---------- Step 2: OTP ---------- */}
      {step === "otp" && (
        <div className="space-y-6">
          <OtpInput
            digits={digits}
            onChange={handleDigitsChange}
            status={otpStatus}
            disabled={verifying || otpStatus === "success"}
          />

          <div className="min-h-[1.5rem]" aria-live="polite">
            {otpStatus === "error" && otpMessage && (
              <p role="alert" className="text-sm font-medium text-danger">
                {otpMessage}
              </p>
            )}
            {otpStatus === "success" && (
              <p className="flex items-center gap-2 text-sm font-semibold text-mint-600">
                <CheckCircle2 size={18} /> {otpMessage}
              </p>
            )}
            {otpStatus === "idle" && resendNotice && (
              <p className="text-sm font-medium text-lavender-700">
                A new code has been sent to {maskedPhone}.
              </p>
            )}
          </div>

          <Button
            size="lg"
            fullWidth
            onClick={handleVerify}
            loading={verifying}
            disabled={attempts >= MAX_ATTEMPTS || otpStatus === "success"}
          >
            Verify &amp; continue
          </Button>

          <div className="text-center text-sm text-ink-soft">
            {secondsLeft > 0 ? (
              <p>
                Resend code in{" "}
                <span className="font-bold tabular-nums text-ink">
                  {formatTimer(secondsLeft)}
                </span>
              </p>
            ) : (
              <p>
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-lavender-700 hover:underline"
                >
                  Resend code
                </button>
              </p>
            )}
          </div>

          <p className="rounded-2xl bg-lavender-50 px-4 py-3 text-xs text-ink-soft">
            Demo only: no SMS is sent. Enter the code{" "}
            <strong className="tracking-widest">{DEMO_OTP}</strong> to continue.
          </p>
        </div>
      )}

      {/* ---------- Step 3: interests ---------- */}
      {step === "interests" && (
        <div className="space-y-6">
          <InterestPicker selected={interests} onChange={setInterests} />

          <p className="text-sm text-ink-soft" aria-live="polite">
            <strong className="text-ink">{interests.length}</strong> selected
            {interests.length < MIN_INTERESTS &&
              ` · pick at least ${MIN_INTERESTS} for the best feed`}
          </p>

          <Button
            size="lg"
            fullWidth
            loading={creating}
            disabled={interests.length < MIN_INTERESTS}
            onClick={() => finish(interests)}
          >
            Finish &amp; start shopping
          </Button>
        </div>
      )}
    </AuthShell>
  );
}