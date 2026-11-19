export const LISTING_CATEGORY_SLUGS = [
  "textbooks",
  "drafters",
  "calculators",
  "art-supplies",
  "stationery",
  "lab-equipment",
  "other",
] as const;

export type ListingCategory = (typeof LISTING_CATEGORY_SLUGS)[number];

export const LISTING_CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;

export type ListingCondition = (typeof LISTING_CONDITIONS)[number];

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ListingCategory;
  condition: ListingCondition;
  image: string;
  sellerId: string;
  sellerName: string;
  college: string;
  city: string;
  postedAt: string; // ISO date
  sold?: boolean;
}