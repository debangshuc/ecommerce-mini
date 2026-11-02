"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md";
  className?: string;
}

export function WishlistButton({
  productId,
  size = "md",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isHydrated } = useWishlist();
  const active = isHydrated && isInWishlist(productId);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "grid place-items-center rounded-full bg-white/95 shadow-soft transition-all hover:scale-105",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        active ? "text-peach-600" : "text-ink-soft hover:text-peach-600",
        className
      )}
    >
      <Heart
        size={size === "sm" ? 16 : 19}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}