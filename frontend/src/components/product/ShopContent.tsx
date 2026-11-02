"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/services/productService";
import { getUnitPrice } from "@/lib/utils";
import type { SortOption } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductCard } from "@/components/product/ProductCard";
import {
  DEFAULT_FILTERS,
  FilterPanel,
  type FilterState,
} from "@/components/product/FilterPanel";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function resolveCategory(slug: string | null): string {
  return slug && categories.some((c) => c.slug === slug) ? slug : "all";
}

export function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = resolveCategory(searchParams.get("category"));

  const allProducts = useMemo(() => getAllProducts(), []);

  const [query, setQuery] = useState(urlQuery);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: urlCategory,
  });
  const [sort, setSort] = useState<SortOption>("popularity");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Brief fake loading so the loading state is visible in demos.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  // Follow changes made from outside (navbar search, footer category links).
  useEffect(() => {
    setQuery(urlQuery);
    setFilters((prev) => ({ ...prev, category: urlCategory }));
  }, [urlQuery, urlCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of allProducts) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [allProducts]);

  const visibleProducts = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const min = filters.minPrice === "" ? null : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);

    const filtered = allProducts.filter((product) => {
      const price = getUnitPrice(product);
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      if (min !== null && !Number.isNaN(min) && price < min) return false;
      if (max !== null && !Number.isNaN(max) && price > max) return false;
      if (filters.inStockOnly && product.stock <= 0) return false;
      if (tokens.length > 0) {
        const haystack = [
          product.name,
          product.description,
          product.brand ?? "",
          product.category.replace(/-/g, " "),
        ]
          .join(" ")
          .toLowerCase();
        if (!tokens.every((token) => haystack.includes(token))) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return getUnitPrice(a) - getUnitPrice(b);
        case "price-desc":
          return getUnitPrice(b) - getUnitPrice(a);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "popularity":
        default:
          return (b.popularity ?? 0) - (a.popularity ?? 0);
      }
    });
  }, [allProducts, query, filters, sort]);

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const updateCategoryParam = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const handleFiltersChange = (next: FilterState) => {
    setFilters(next);
    if (next.category !== filters.category) updateCategoryParam(next.category);
  };

  const handleClear = () => {
    setQuery("");
    setFilters(DEFAULT_FILTERS);
    router.replace("/shop", { scroll: false });
  };

  const filterPanel = (
    <FilterPanel
      filters={filters}
      onChange={handleFiltersChange}
      onClear={handleClear}
      categoryCounts={categoryCounts}
      totalCount={allProducts.length}
    />
  );

  return (
    <div className="container-page py-8 lg:py-12">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Shop All Stationery</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Notebooks, pens, art supplies, calculators and more. Search, filter
          and sort to find exactly what your semester needs.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands or categories"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            leftIcon={<SlidersHorizontal size={16} />}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label="Sort products"
            className="h-12 flex-1 rounded-full border border-line bg-white px-4 text-sm font-medium focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100 sm:flex-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-line bg-white p-5">
            {filterPanel}
          </div>
        </aside>

        <div>
          {!ready ? (
            <div className="grid place-items-center py-24">
              <LoadingSpinner size="lg" label="Loading products" />
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-lavender-100 text-lavender-600">
                <SearchX size={36} strokeWidth={1.6} />
              </span>
              <h2 className="mt-6 text-2xl font-bold">No products found</h2>
              <p className="mt-2 text-ink-soft">
                We couldn&apos;t find anything matching your search and filters.
                Try different keywords or clear the filters.
              </p>
              <Button className="mt-6" onClick={handleClear}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-ink-soft" aria-live="polite">
                Showing{" "}
                <strong className="text-ink">{visibleProducts.length}</strong> of{" "}
                {allProducts.length} products
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={visibleProducts.length}
      >
        {filterPanel}
      </MobileFilterDrawer>
    </div>
  );
}