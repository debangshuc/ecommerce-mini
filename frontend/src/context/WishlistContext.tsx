"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";

interface WishlistContextValue {
  wishlistIds: string[];
  count: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.wishlist);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setWishlistIds(
            parsed.filter((id): id is string => typeof id === "string")
          );
        }
      }
    } catch {
      // Corrupt or unavailable storage: start with an empty wishlist.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.wishlist,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // Storage full or blocked: ignore.
    }
  }, [wishlistIds, isHydrated]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setWishlistIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      count: wishlistIds.length,
      isHydrated,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      wishlistIds,
      isHydrated,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return context;
}