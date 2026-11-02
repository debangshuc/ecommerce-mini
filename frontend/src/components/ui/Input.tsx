"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightElement, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-ink placeholder:text-ink-muted transition-colors focus:outline-none focus:ring-4",
            error
              ? "border-danger focus:ring-danger/15"
              : "border-line focus:border-lavender-400 focus:ring-lavender-100",
            leftIcon ? "pl-12" : undefined,
            rightElement ? "pr-12" : undefined,
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={cn("mt-1.5 text-xs", error ? "text-danger" : "text-ink-muted")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});