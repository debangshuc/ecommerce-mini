import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  discountedPrice?: number;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
  className?: string;
}

const currentSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-3xl",
} as const;

const oldSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
} as const;

export function PriceDisplay({
  price,
  discountedPrice,
  size = "md",
  showPercent = false,
  className,
}: PriceDisplayProps) {
  const current =
    discountedPrice !== undefined && discountedPrice < price
      ? discountedPrice
      : price;
  const hasDiscount = current < price;
  const percent = getDiscountPercent(price, discountedPrice);

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-bold text-ink", currentSizes[size])}>
        {formatPrice(current)}
      </span>
      {hasDiscount && (
        <span className={cn("text-ink-muted line-through", oldSizes[size])}>
          {formatPrice(price)}
        </span>
      )}
      {hasDiscount && showPercent && (
        <span className="rounded-full bg-mint-100 px-2 py-0.5 text-xs font-bold text-mint-600">
          {percent}% off
        </span>
      )}
    </div>
  );
}