"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: ReactNode;
}

export function MobileFilterDrawer({
  open,
  onClose,
  resultCount,
  children,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-cream shadow-lift transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-lavender-50"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
        <div className="border-t border-line p-5">
          <Button fullWidth size="lg" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </Button>
        </div>
      </aside>
    </div>
  );
}