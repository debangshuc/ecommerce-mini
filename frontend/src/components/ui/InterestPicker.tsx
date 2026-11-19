"use client";

import { Check } from "lucide-react";
import { INTERESTS } from "@/data/interests";
import { cn } from "@/lib/utils";

interface InterestPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function InterestPicker({
  selected,
  onChange,
  className = "grid grid-cols-2 gap-3",
}: InterestPickerProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
    );
  };

  return (
    <div className={className} role="group" aria-label="Choose your interests">
      {INTERESTS.map((interest) => {
        const active = selected.includes(interest.id);
        const Icon = interest.icon;
        return (
          <button
            key={interest.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(interest.id)}
            className={cn(
              "relative rounded-2xl border p-4 text-left transition-all",
              active
                ? "border-lavender-500 bg-lavender-50 shadow-soft"
                : "border-line bg-white hover:border-lavender-400"
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-xl",
                interest.tone
              )}
            >
              <Icon size={20} />
            </span>
            <span className="mt-3 block text-sm font-bold leading-snug">
              {interest.label}
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              {interest.description}
            </span>
            {active && (
              <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-lavender-600 text-white">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}