"use client";

import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface FilterState {
  category: string; // "all" or a category slug
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  category: "all",
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
};

const PRICE_PRESETS = [
  { label: "Under ₹200", min: "", max: "200" },
  { label: "₹200 – ₹500", min: "200", max: "500" },
  { label: "₹500 – ₹1,000", min: "500", max: "1000" },
  { label: "Above ₹1,000", min: "1000", max: "" },
];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  categoryCounts,
  totalCount,
}: FilterPanelProps) {
  const priceInputClass =
    "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100";

  return (
    <div className="space-y-8">
      <section id="categories">
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider">
          Category
        </h3>
        <ul className="mt-3 space-y-1">
          {[{ slug: "all", name: "All categories", count: totalCount }, ...categories.map((c) => ({ slug: c.slug, name: c.name, count: categoryCounts[c.slug] ?? 0 }))].map(
            (item) => {
              const active = filters.category === item.slug;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange({ ...filters, category: item.slug })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-lavender-100 font-semibold text-lavender-700"
                        : "text-ink-soft hover:bg-lavender-50"
                    )}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-ink-muted">{item.count}</span>
                  </button>
                </li>
              );
            }
          )}
        </ul>
      </section>

      <section>
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider">
          Price range (₹)
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className={priceInputClass}
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className={priceInputClass}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    ...filters,
                    minPrice: active ? "" : preset.min,
                    maxPrice: active ? "" : preset.max,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-lavender-500 bg-lavender-100 text-lavender-700"
                    : "border-line bg-white text-ink-soft hover:border-lavender-400"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider">
          Availability
        </h3>
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-4 w-4 rounded border-line accent-lavender-600"
          />
          In stock only
        </label>
      </section>

      <Button variant="outline" fullWidth onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}