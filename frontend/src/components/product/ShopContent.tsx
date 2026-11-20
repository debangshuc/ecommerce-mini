"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, SlidersHorizontal, Sparkles } from "lucide-react";
import { categories, getCategoryName } from "@/data/categories";
import { getInterestScore } from "@/data/interests";
import { useAuth } from "@/context/AuthContext";
import { getAllProducts } from "@/services/productService";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { getUnitPrice } from "@/lib/utils";
import type { Category, SortOption } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryCard } from "@/components/home/CategoryCard";
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

const RECOMMENDED_OPTION: { value: SortOption; label: string } = {
  value: "recommended",
  label: "Recommended for you",
};

const ALL_TILE: Category = {
  id: "all",
  name: "All Products",
  slug: "all",
  description: "Everything in the store",
  image: categories[0]?.image ?? PLACEHOLDER_IMAGE,
  accent: "lavender",
};

function resolveCategory(slug: string | null): string {
  return slug && categories.some((c) => c.slug === slug) ? slug : "all";
}

export function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isStudent } = useAuth();

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = resolveCategory(searchParams.get("category"));

  const allProducts = useMemo(() => getAllProducts(), []);
  const interests = useMemo(() => user?.interests ?? [], [user]);
  const hasInterests = interests.length > 0;

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("popularity");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const sortTouched = useRef(false);

  // Brief fake loading so the loading state is visible in demos.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  // Follow changes made from outside (navbar search, footer links, hero buttons).
  useEffect(() => {
    setQuery(urlQuery);
    setCategory(urlCategory);
  }, [urlQuery, urlCategory]);

  // Default to "Recommended" once we know the user has interests.
  useEffect(() => {
    if (hasInterests && !sortTouched.current) {
      setSort("recommended");
    }
    if (!hasInterests) {
      setSort((prev) => (prev === "recommended" ? "popularity" : prev));
    }
  }, [hasInterests]);

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
      const price = getUnitPrice(product, isStudent);
      if (category !== "all" && product.category !== category) return false;
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

    const byPopularity = (a: (typeof filtered)[number], b: (typeof filtered)[number]) =>
      (b.popularity ?? 0) - (a.popularity ?? 0);

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "recommended":
          return (
            getInterestScore(b.category, interests) -
              getInterestScore(a.category, interests) || byPopularity(a, b)
          );
        case "price-asc":
          return getUnitPrice(a, isStudent) - getUnitPrice(b, isStudent);
        case "price-desc":
          return getUnitPrice(b, isStudent) - getUnitPrice(a, isStudent);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "popularity":
        default:
          return byPopularity(a, b);
      }
    });
  }, [allProducts, query, category, filters, sort, isStudent, interests]);

  const activeFilterCount =
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const handleCategorySelect = (slug: string) => {
    setCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  };

  const handleSortChange = (value: SortOption) => {
    sortTouched.current = true;
    setSort(value);
  };

  const handleClear = () => {
    setQuery("");
    setCategory("all");
    setFilters(DEFAULT_FILTERS);
    router.replace("/", { scroll: false });
  };

  const sortOptions = hasInterests
    ? [RECOMMENDED_OPTION, ...SORT_OPTIONS]
    : SORT_OPTIONS;

  const filterPanel = (
    <FilterPanel filters={filters} onChange={setFilters} onClear={handleClear} />
  );

  return (
    <div className="container-page py-12 lg:py-16">
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lavender-600">
          Shop
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Shop All Stationery</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Pick a category, search, and filter or sort to find exactly what your
          semester needs.
        </p>
      </header>

      {/* Category tiles = category filters */}
      <div
        role="group"
        aria-label="Filter by category"
        className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        <CategoryCard
          category={ALL_TILE}
          productCount={allProducts.length}
          active={category === "all"}
          onSelect={handleCategorySelect}
        />
        {categories.map((item) => (
          <CategoryCard
            key={item.id}
            category={item}
            productCount={categoryCounts[item.slug] ?? 0}
            active={category === item.slug}
            onSelect={handleCategorySelect}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
            onChange={(event) => handleSortChange(event.target.value as SortOption)}
            aria-label="Sort products"
            className="h-12 flex-1 rounded-full border border-line bg-white px-4 text-sm font-medium focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100 sm:flex-none"
          >
            {sortOptions.map((option) => (
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
              <h3 className="mt-6 text-2xl font-bold">No products found</h3>
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
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-soft" aria-live="polite">
                  Showing{" "}
                  <strong className="text-ink">{visibleProducts.length}</strong>{" "}
                  of {allProducts.length} products
                  {category !== "all" && <> in {getCategoryName(category)}</>}
                </p>
                {sort === "recommended" && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-lavender-700">
                    <Sparkles size={14} /> Sorted by your interests
                  </p>
                )}
              </div>
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