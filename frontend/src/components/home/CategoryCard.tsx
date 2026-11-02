import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

const accentBackgrounds: Record<Category["accent"], string> = {
  lavender: "bg-lavender-100",
  sky: "bg-sky-100",
  peach: "bg-peach-100",
  mint: "bg-mint-100",
};

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group block"
      aria-label={`Browse ${category.name}`}
    >
      <div
        className={cn(
          "rounded-card p-3 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift",
          accentBackgrounds[category.accent]
        )}
      >
        <ProductImage
          src={category.image}
          alt={category.name}
          className="aspect-square w-full rounded-2xl"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
        />
        <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{category.name}</p>
            {productCount !== undefined && (
              <p className="text-xs text-ink-soft">
                {productCount} {productCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}