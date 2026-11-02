"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Heart, ShoppingCart, User, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/layout/SearchBar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  // Lock page scroll and close with the Escape key while the drawer is open.
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
        aria-label="Main menu"
        className={cn(
          "absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-cream shadow-lift transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-xl font-bold">
            Campus<span className="text-lavender-600">Cart</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-lavender-50"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <SearchBar onSearch={onClose} />

          <nav className="mt-6 flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="border-b border-line py-4 text-lg font-semibold text-ink hover:text-lavender-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 grid gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink-soft hover:bg-lavender-50"
            >
              <Heart size={18} /> Wishlist
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink-soft hover:bg-lavender-50"
            >
              <ShoppingCart size={18} /> Cart
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-ink-soft hover:bg-lavender-50"
            >
              <User size={18} /> My Account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
          <Link
            href="/login"
            onClick={onClose}
            className="rounded-full border border-line bg-white py-3 text-center text-sm font-semibold hover:border-lavender-400"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={onClose}
            className="rounded-full bg-lavender-600 py-3 text-center text-sm font-semibold text-white hover:bg-lavender-700"
          >
            Sign up
          </Link>
        </div>
      </aside>
    </div>
  );
}