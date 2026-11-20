"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockListings } from "@/data/listings";
import { STORAGE_KEYS } from "@/lib/constants";
import type {
  Listing,
  ListingCategory,
  ListingCondition,
} from "@/types/marketplace";

export interface NewListingInput {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ListingCondition;
  image: string;
}

export interface ListingSeller {
  id: string;
  name: string;
  college: string;
  city: string;
}

interface MarketplaceContextValue {
  /** Listings created in this browser + mock listings, newest first. */
  listings: Listing[];
  isHydrated: boolean;
  addListing: (input: NewListingInput, seller: ListingSeller) => Listing;
  deleteListing: (id: string) => void;
  toggleSold: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(
  undefined
);

function isListing(value: unknown): value is Listing {
  if (typeof value !== "object" || value === null) return false;
  const l = value as Partial<Listing>;
  return (
    typeof l.id === "string" &&
    typeof l.title === "string" &&
    typeof l.price === "number" &&
    typeof l.sellerId === "string"
  );
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.listings);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setUserListings(parsed.filter(isListing));
      }
    } catch {
      // Corrupt or unavailable storage: start with no personal listings.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.listings,
        JSON.stringify(userListings)
      );
    } catch {
      // Storage full or blocked: listings just won't persist after refresh.
    }
  }, [userListings, isHydrated]);

  const addListing = useCallback(
    (input: NewListingInput, seller: ListingSeller): Listing => {
      const listing: Listing = {
        id: `listing-${Date.now()}`,
        title: input.title,
        description: input.description,
        price: input.price,
        category: input.category,
        condition: input.condition,
        image: input.image,
        sellerId: seller.id,
        sellerName: seller.name,
        college: seller.college,
        city: seller.city,
        postedAt: new Date().toISOString(),
        sold: false,
      };
      setUserListings((prev) => [listing, ...prev]);
      return listing;
    },
    []
  );

  const deleteListing = useCallback((id: string) => {
    setUserListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleSold = useCallback((id: string) => {
    setUserListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, sold: !l.sold } : l))
    );
  }, []);

  const value = useMemo<MarketplaceContextValue>(() => {
    const listings = [...userListings, ...mockListings].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
    return { listings, isHydrated, addListing, deleteListing, toggleSold };
  }, [userListings, isHydrated, addListing, deleteListing, toggleSold]);

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): MarketplaceContextValue {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used inside <MarketplaceProvider>");
  }
  return context;
}