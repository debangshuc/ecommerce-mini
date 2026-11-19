"use client";

import { GraduationCap } from "lucide-react";
import type { Product } from "@/types/product";
import { usePricing } from "@/hooks/usePricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

interface ProductPriceProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ProductPrice({
  product,
  size = "md",
  showPercent = false,
  showLabel = false,
  className,
}: ProductPriceProps) {
  const { getInfo } = usePricing();
  const info = getInfo(product);

  return (
    <div className={className}>
      <PriceDisplay
        price={info.original}
        discountedPrice={info.hasDiscount ? info.current : undefined}
        size={size}
        showPercent={showPercent}
      />
      {showLabel && info.hasDiscount && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-mint-600">
          <GraduationCap size={14} /> Student price applied
        </p>
      )}
    </div>
  );
}