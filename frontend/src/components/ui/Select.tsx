"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, className, id, children, ...props }, ref) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            className={cn(
              "h-12 w-full appearance-none rounded-2xl border bg-white px-4 pr-10 text-sm text-ink transition-colors focus:outline-none focus:ring-4",
              error
                ? "border-danger focus:ring-danger/15"
                : "border-line focus:border-lavender-400 focus:ring-lavender-100",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);