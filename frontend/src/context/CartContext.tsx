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
import { calculateDelivery, getUnitPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  isHydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    typeof item.product === "object" &&
    item.product !== null &&
    typeof item.product.id === "string"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load the saved cart once, after the first render in the browser.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.cart);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isValidCartItem));
        }
      }
    } catch {
      // Corrupt or unavailable storage: start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  // Save the cart whenever it changes (only after the first load).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch {
      // Storage full or blocked: ignore.
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0 || quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getItemQuantity = useCallback(
    (productId: string) =>
      items.find((item) => item.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + getUnitPrice(item.product) * item.quantity,
      0
    );
    const deliveryCharge = calculateDelivery(subtotal);
    return {
      items,
      totalItems,
      subtotal,
      deliveryCharge,
      total: subtotal + deliveryCharge,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
    };
  }, [
    items,
    isHydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}