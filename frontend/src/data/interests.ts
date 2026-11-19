import {
  BookOpen,
  Building2,
  Calculator,
  Cog,
  Palette,
  PenTool,
  Stethoscope,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { ListingCategory } from "@/types/marketplace";

export interface Interest {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: string; // Tailwind classes for the icon bubble
  categories: string[]; // product category slugs
  listingCategories: ListingCategory[]; // Buy & Sell categories
}

export const INTERESTS: Interest[] = [
  {
    id: "engineering",
    label: "Engineering",
    description: "Calculators, drafters, lab notebooks",
    icon: Cog,
    tone: "bg-sky-100 text-sky-500",
    categories: ["calculators", "geometry-boxes", "notebooks", "study-accessories"],
    listingCategories: ["textbooks", "drafters", "calculators", "lab-equipment"],
  },
  {
    id: "art-painting",
    label: "Art & Painting",
    description: "Paints, pastels, sketch pads",
    icon: Palette,
    tone: "bg-peach-100 text-peach-600",
    categories: ["art-craft", "markers-highlighters"],
    listingCategories: ["art-supplies"],
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "Drafting tools, fineliners, sketchbooks",
    icon: Building2,
    tone: "bg-lavender-100 text-lavender-700",
    categories: ["geometry-boxes", "art-craft", "pens-pencils", "desk-organisers"],
    listingCategories: ["drafters", "art-supplies"],
  },
  {
    id: "medical-science",
    label: "Medical & Science",
    description: "Highlighters, notes, study aids",
    icon: Stethoscope,
    tone: "bg-mint-100 text-mint-600",
    categories: ["markers-highlighters", "sticky-notes", "notebooks", "study-accessories"],
    listingCategories: ["textbooks", "lab-equipment"],
  },
  {
    id: "stationery",
    label: "Stationery",
    description: "Pens, notebooks, files, desk gear",
    icon: PenTool,
    tone: "bg-lavender-100 text-lavender-700",
    categories: ["pens-pencils", "notebooks", "sticky-notes", "files-folders", "desk-organisers"],
    listingCategories: ["stationery"],
  },
  {
    id: "books",
    label: "Books",
    description: "Reading stands, planners, bookmarks",
    icon: BookOpen,
    tone: "bg-peach-100 text-peach-600",
    categories: ["study-accessories", "sticky-notes", "notebooks"],
    listingCategories: ["textbooks"],
  },
  {
    id: "competitive-exams",
    label: "Competitive Exam Preparation",
    description: "Exam pads, planners, kits",
    icon: Target,
    tone: "bg-sky-100 text-sky-500",
    categories: ["exam-essentials", "study-accessories", "calculators", "notebooks", "student-kits"],
    listingCategories: ["textbooks", "calculators", "stationery"],
  },
  {
    id: "maths",
    label: "Maths & Calculation",
    description: "Scientific calculators, geometry boxes",
    icon: Calculator,
    tone: "bg-mint-100 text-mint-600",
    categories: ["calculators", "geometry-boxes", "exam-essentials"],
    listingCategories: ["calculators", "textbooks"],
  },
];

/** How many of the selected interests include this product category. */
export function getInterestScore(category: string, interestIds: string[]): number {
  return INTERESTS.filter(
    (interest) =>
      interestIds.includes(interest.id) && interest.categories.includes(category)
  ).length;
}

/** How many of the selected interests include this Buy & Sell category. */
export function getListingInterestScore(
  category: ListingCategory,
  interestIds: string[]
): number {
  return INTERESTS.filter(
    (interest) =>
      interestIds.includes(interest.id) &&
      interest.listingCategories.includes(category)
  ).length;
}

/** Products matching the user's interests, best matches first. */
export function getRecommendedProducts(
  products: Product[],
  interestIds: string[],
  limit = 4
): Product[] {
  if (interestIds.length === 0) return [];
  return products
    .map((product) => ({
      product,
      score: getInterestScore(product.category, interestIds),
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.product.popularity ?? 0) - (a.product.popularity ?? 0)
    )
    .slice(0, limit)
    .map((entry) => entry.product);
}