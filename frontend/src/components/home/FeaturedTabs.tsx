"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { usePricing } from "@/hooks/usePricing";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

type TabId = "bestselling" | "favourites" | "budget";

const TABS: { id: TabId; label: string; subtitle: string }[] = [
  {
    id: "bestselling",
    label: "Bestselling",
    subtitle: "What students are adding to their carts the most.",
  },
  {
    id: "favourites",
    label: "Student Favourites",
    subtitle: "Highly rated picks from students like you.",
  },
  {
    id: "budget",
    label: "Under ₹200",
    subtitle: "Quality essentials that go easy on your pocket money.",
  },
];

export function FeaturedTabs({ products }: { products: Product[] }) {
  const { getUnit } = usePricing();
  const [active, setActive] = useState<TabId>("bestselling");

  const lists = useMemo(() => {
    const byPopularity = (a: Product, b: Product) =>
      (b.popularity ?? 0) - (a.popularity ?? 0);

    return {
      bestselling: [...products].sort(byPopularity).slice(0, 4),
      favourites: products
        .filter((p) => (p.rating ?? 0) >= 4.7)
        .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
        .slice(0, 4),
      budget: products
        .filter((p) => getUnit(p) <= 200)
        .sort(byPopularity)
        .slice(0, 4),
    } satisfies Record<TabId, Product[]>;
  }, [products, getUnit]);

  const current = TABS.find((tab) => tab.id === active) ?? TABS[0];

  return (
    <section className="border-y border-line bg-lavender-50/60">
      <div className="container-page py-12 lg:py-16">
        <SectionHeading
          eyebrow="Featured"
          title="Featured Products"
          subtitle={current.subtitle}
        />

        <div
          role="tablist"
          aria-label="Featured product groups"
          className="mt-6 flex flex-wrap gap-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                active === tab.id
                  ? "bg-lavender-600 text-white shadow-soft"
                  : "bg-white text-ink-soft hover:bg-lavender-100 hover:text-lavender-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {lists[active].map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}