"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPriceInfo, type PriceInfo } from "@/lib/student";
import type { Product } from "@/types/product";

/** Price helpers that automatically follow the logged-in user's email type. */
export function usePricing() {
  const { isStudent } = useAuth();

  const getInfo = useCallback(
    (product: Product): PriceInfo => getPriceInfo(product, isStudent),
    [isStudent]
  );

  const getUnit = useCallback(
    (product: Product): number => getPriceInfo(product, isStudent).current,
    [isStudent]
  );

  return { isStudent, getInfo, getUnit };
}