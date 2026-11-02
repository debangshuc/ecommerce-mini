import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from "./constants";
import type { Product } from "@/types/product";

/** Joins class names, ignoring falsy values. Usage: cn("a", cond && "b") */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** 1299 -> "₹1,299" (Indian number format) */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Returns discount percentage, e.g. price 100, discounted 80 -> 20 */
export function getDiscountPercent(
  price: number,
  discountedPrice?: number
): number {
  if (!discountedPrice || discountedPrice >= price) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
}

/** The price the customer actually pays for one unit. */
export function getUnitPrice(product: Product): number {
  return product.discountedPrice !== undefined &&
    product.discountedPrice < product.price
    ? product.discountedPrice
    : product.price;
}

/** Delivery is free above the threshold; empty cart has no delivery fee. */
export function calculateDelivery(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}