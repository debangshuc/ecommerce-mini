"use client";

import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  active?: boolean;
  onSelect: (slug: string) => void;
}

const accentBackgrounds: Record<Category["accent"], string> = {
  lavender: "bg-lavender-100",
  sky: "bg-sky-100",
  peach: "bg-peach-100",
  mint: "bg-mint-100",
};

export function CategoryCard({
  category,
  productCount,
  active = false,
  onSelect,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.slug)}
      aria-pressed={active}
      aria-label={`Show ${category.name}`}
      className={cn(
        "group w-32 shrink-0 snap-start rounded-2xl p-2 text-left transition-all duration-200 sm:w-36",
        accentBackgrounds[category.accent],
        active
          ? "shadow-lift ring-2 ring-lavender-500"
          : "hover:-translate-y-0.5 hover:shadow-soft"
      )}
    >
      <ProductImage
        src={category.image}
        alt=""
        className="aspect-square w-full rounded-xl"
        imageClassName="transition-transform duration-500 group-hover:scale-105"
        sizes="144px"
      />
      <p className="mt-2 line-clamp-2 min-h-[2.5rem] px-1 text-xs font-bold leading-snug text-ink">
        {category.name}
      </p>
      {productCount !== undefined && (
        <p className="px-1 pb-1 text-[11px] text-ink-soft">
          {productCount} {productCount === 1 ? "item" : "items"}
        </p>
      )}
    </button>
  );
}