"use client";

import {
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  status?: "idle" | "error" | "success";
  disabled?: boolean;
}

export function OtpInput({
  digits,
  onChange,
  status = "idle",
  disabled = false,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const focusAt = (index: number) => refs.current[index]?.focus();

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next);
    if (digit && index < digits.length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      onChange(next);
      focusAt(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (event.key === "ArrowRight" && index < digits.length - 1) {
      focusAt(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, digits.length);
    if (!pasted) return;
    onChange(digits.map((_, i) => pasted[i] ?? ""));
    focusAt(Math.min(pasted.length, digits.length - 1));
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="One-time password">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={status === "error" ? true : undefined}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={cn(
            "h-12 w-full max-w-[3.25rem] rounded-xl border bg-white text-center text-lg font-bold transition-colors focus:outline-none focus:ring-4 disabled:opacity-60 sm:h-14",
            status === "error" &&
              "border-danger bg-peach-100/40 focus:ring-danger/15",
            status === "success" &&
              "border-mint-500 bg-mint-100/60 text-mint-600 focus:ring-mint-200",
            status === "idle" &&
              "border-line focus:border-lavender-400 focus:ring-lavender-100"
          )}
        />
      ))}
    </div>
  );
}