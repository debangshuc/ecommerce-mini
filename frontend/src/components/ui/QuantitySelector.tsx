"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled = false,
}: QuantitySelectorProps) {
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-white p-0.5"
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center rounded-full text-ink-soft transition-colors hover:bg-lavender-50 hover:text-lavender-700 disabled:cursor-not-allowed disabled:opacity-40",
          buttonSize
        )}
      >
        <Minus size={size === "sm" ? 14 : 16} />
      </button>

      <span
        aria-live="polite"
        className={cn(
          "text-center text-sm font-bold tabular-nums",
          size === "sm" ? "min-w-8" : "min-w-10"
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center rounded-full text-ink-soft transition-colors hover:bg-lavender-50 hover:text-lavender-700 disabled:cursor-not-allowed disabled:opacity-40",
          buttonSize
        )}
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}