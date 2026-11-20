"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MarketplaceProvider>{children}</MarketplaceProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}