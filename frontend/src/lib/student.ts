import type { Product } from "@/types/product";

/** Students get this much off when a product has no explicit student price. */
export const STUDENT_DEFAULT_DISCOUNT = 0.1;

/**
 * Detects college emails by domain: .edu, .ac.in, .edu.in, .ac.uk, .edu.au …
 * Frontend-only simulation, so nothing is verified with a college.
 */
export function isCollegeEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return false;
  return /(^|\.)(edu|ac)(\.[a-z]{2})?$/.test(domain);
}

/** product.discountedPrice is treated as the student price. */
export function getStudentPrice(product: Product): number {
  if (
    product.discountedPrice !== undefined &&
    product.discountedPrice < product.price
  ) {
    return product.discountedPrice;
  }
  return Math.round(product.price * (1 - STUDENT_DEFAULT_DISCOUNT));
}

export interface PriceInfo {
  original: number;
  current: number;
  percent: number;
  hasDiscount: boolean;
}

export function getPriceInfo(product: Product, isStudent: boolean): PriceInfo {
  const current = isStudent ? getStudentPrice(product) : product.price;
  const hasDiscount = current < product.price;
  const percent = hasDiscount
    ? Math.round(((product.price - current) / product.price) * 100)
    : 0;
  return { original: product.price, current, percent, hasDiscount };
}