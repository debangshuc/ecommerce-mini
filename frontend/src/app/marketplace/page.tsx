"use client";

import { useMemo, useState } from "react";
import { Plus, Search, SearchX, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getListingInterestScore } from "@/data/interests";
import { LISTING_CATEGORIES, getListingCategoryLabel } from "@/data/listings";
import { cn } from "@/lib/utils";
import {
  LISTING_CONDITIONS,
  type Listing,
  type ListingCategory,
  type ListingCondition,
} from "@/types/marketplace";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { ContactSellerModal } from "@/components/marketplace/ContactSellerModal";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { ListingForm } from "@/components/marketplace/ListingForm";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function MarketplacePage() {
  const { user } = useAuth();
  const { listings, isHydrated, deleteListing, toggleSold } = useMarketplace();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ListingCategory | "all">("all");
  const [condition, setCondition] = useState<ListingCondition | "all">("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [forMe, setForMe] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [contactListing, setContactListing] = useState<Listing | null>(null);
  const [notice, setNotice] = useState("");

  const interests = useMemo(() => user?.interests ?? [], [user]);
  const hasInterests = interests.length > 0;

  const visible = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const filtered = listings.filter((listing) => {
      const mine = user !== null && listing.sellerId === user.id;
      if (onlyMine && !mine) return false;
      if (!onlyMine && listing.sold) return false; // sold items only show under "My listings"
      if (category !== "all" && listing.category !== category) return false;
      if (condition !== "all" && listing.condition !== condition) return false;
      if (max !== null && !Number.isNaN(max) && listing.price > max) return false;
      if (forMe && getListingInterestScore(listing.category, interests) === 0) {
        return false;
      }
      if (tokens.length > 0) {
        const haystack = [
          listing.title,
          listing.description,
          getListingCategoryLabel(listing.category),
          listing.college,
          listing.city,
        ]
          .join(" ")
          .toLowerCase();
        if (!tokens.every((token) => haystack.includes(token))) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }, [listings, user, query, category, condition, maxPrice, sort, forMe, onlyMine, interests]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setCondition("all");
    setMaxPrice("");
    setForMe(false);
    setOnlyMine(false);
  };

  const handleCreated = (listing: Listing) => {
    setShowForm(false);
    clearFilters();
    setNotice(`"${listing.title}" is now live in Buy & Sell.`);
  };

  if (!isHydrated) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" label="Loading listings" />
      </div>
    );
  }

  const toggleClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
      active
        ? "border-lavender-500 bg-lavender-100 text-lavender-700"
        : "border-line bg-white text-ink-soft hover:border-lavender-400"
    );

  return (
    <div className="container-page py-8 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lavender-600">
            Buy &amp; Sell
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Second-hand academic essentials
          </h1>
          <p className="mt-2 text-ink-soft">
            Buy textbooks, drafters, calculators and art supplies from fellow
            students, or list your own for the next batch.
          </p>
        </div>
        {user ? (
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            leftIcon={<Plus size={18} />}
          >
            List an item
          </Button>
        ) : (
          <Button href="/login" size="lg" variant="outline">
            Log in to sell
          </Button>
        )}
      </header>

      {notice && (
        <div
          role="status"
          className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-mint-100 px-5 py-3 text-sm font-medium text-mint-600"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category chips */}
      <div
        role="group"
        aria-label="Filter by category"
        className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {[{ slug: "all" as const, label: "All" }, ...LISTING_CATEGORIES].map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={category === item.slug}
            onClick={() => setCategory(item.slug)}
            className={cn("shrink-0", toggleClass(category === item.slug))}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search listings, colleges or cities"
            aria-label="Search listings"
            className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
          />
        </div>
        <select
          value={condition}
          onChange={(event) =>
            setCondition(event.target.value as ListingCondition | "all")
          }
          aria-label="Filter by condition"
          className="h-12 rounded-full border border-line bg-white px-4 text-sm font-medium focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
        >
          <option value="all">Any condition</option>
          {LISTING_CONDITIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Max ₹"
          aria-label="Maximum price"
          className="h-12 w-full rounded-full border border-line bg-white px-4 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100 md:w-28"
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort listings"
          className="h-12 rounded-full border border-line bg-white px-4 text-sm font-medium focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick toggles */}
      {(hasInterests || user) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {hasInterests && (
            <button
              type="button"
              aria-pressed={forMe}
              onClick={() => setForMe((v) => !v)}
              className={toggleClass(forMe)}
            >
              <Sparkles size={16} /> Matches my interests
            </button>
          )}
          {user && (
            <button
              type="button"
              aria-pressed={onlyMine}
              onClick={() => setOnlyMine((v) => !v)}
              className={toggleClass(onlyMine)}
            >
              <UserRound size={16} /> My listings
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <p className="mb-5 mt-6 text-sm text-ink-soft" aria-live="polite">
        Showing <strong className="text-ink">{visible.length}</strong>{" "}
        {visible.length === 1 ? "listing" : "listings"}
        {onlyMine ? " (including sold items)" : ""}
      </p>

      {visible.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center py-14 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-lavender-100 text-lavender-600">
            <SearchX size={36} strokeWidth={1.6} />
          </span>
          <h2 className="mt-6 text-2xl font-bold">
            {onlyMine ? "You haven't listed anything yet" : "No listings found"}
          </h2>
          <p className="mt-2 text-ink-soft">
            {onlyMine
              ? "Sell your old textbooks and tools to students who need them."
              : "Try different keywords or clear the filters."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            {user && (
              <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={16} />}>
                List an item
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isOwner={user !== null && listing.sellerId === user.id}
              onContact={setContactListing}
              onToggleSold={toggleSold}
              onDelete={deleteListing}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="List an item for sale"
        size="lg"
      >
        {showForm && (
          <ListingForm
            onDone={() => setShowForm(false)}
            onCreated={handleCreated}
          />
        )}
      </Modal>

      <ContactSellerModal
        listing={contactListing}
        onClose={() => setContactListing(null)}
      />
    </div>
  );
}