export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string; // matches Category.slug
  image: string;
  images?: string[]; // extra gallery images (optional)
  stock: number;
  rating?: number;
  reviewCount?: number;
  popularity?: number; // mock value used for "Popularity" sorting
  brand?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: "lavender" | "sky" | "peach" | "mint";
}

export type SortOption =
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export type AvailabilityFilter = "all" | "in-stock";