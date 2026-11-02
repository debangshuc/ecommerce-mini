import type { Category } from "@/types/product";

const unsplash = (photoId: string): string =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;

export const categories: Category[] = [
  {
    id: "c1",
    name: "Notebooks & Registers",
    slug: "notebooks",
    description: "Ruled, dotted and spiral notebooks for every subject.",
    image: unsplash("photo-1544816155-12df9643f363"),
    accent: "lavender",
  },
  {
    id: "c2",
    name: "Pens & Pencils",
    slug: "pens-pencils",
    description: "Ball pens, gel pens and pencils for smooth writing.",
    image: unsplash("photo-1455390582262-044cdead277a"),
    accent: "sky",
  },
  {
    id: "c3",
    name: "Highlighters & Markers",
    slug: "markers-highlighters",
    description: "Colourful highlighters and fineliners for neat notes.",
    image: unsplash("photo-1587145820266-a5951ee6f620"),
    accent: "peach",
  },
  {
    id: "c4",
    name: "Sticky Notes",
    slug: "sticky-notes",
    description: "Reminders and quick notes that stay put.",
    image: unsplash("photo-1568667256549-094345857637"),
    accent: "mint",
  },
  {
    id: "c5",
    name: "Files & Folders",
    slug: "files-folders",
    description: "Keep assignments and certificates organised.",
    image: unsplash("photo-1507925921958-8a62f3d1a50d"),
    accent: "sky",
  },
  {
    id: "c6",
    name: "Art & Craft",
    slug: "art-craft",
    description: "Pastels, paints and sketch pads for project work.",
    image: unsplash("photo-1513364776144-60967b0f800f"),
    accent: "peach",
  },
  {
    id: "c7",
    name: "Geometry Boxes",
    slug: "geometry-boxes",
    description: "Compasses, protractors and rulers for maths class.",
    image: unsplash("photo-1509228468518-180dd4864904"),
    accent: "mint",
  },
  {
    id: "c8",
    name: "Calculators",
    slug: "calculators",
    description: "Scientific and basic calculators for exams and daily use.",
    image: unsplash("photo-1564939558297-fc396f18e5c7"),
    accent: "lavender",
  },
  {
    id: "c9",
    name: "Desk Organisers",
    slug: "desk-organisers",
    description: "Tidy desk, tidy mind.",
    image: unsplash("photo-1513475382585-d06e58bcb0e0"),
    accent: "sky",
  },
  {
    id: "c10",
    name: "Exam Essentials",
    slug: "exam-essentials",
    description: "Everything you need to carry into the exam hall.",
    image: unsplash("photo-1434030216411-0b793f4b4173"),
    accent: "peach",
  },
  {
    id: "c11",
    name: "Student Kits",
    slug: "student-kits",
    description: "Ready-made bundles for freshers and hostel life.",
    image: unsplash("photo-1512820790803-83ca734da794"),
    accent: "lavender",
  },
  {
    id: "c12",
    name: "Study Accessories",
    slug: "study-accessories",
    description: "Planners, book stands and reading lights.",
    image: unsplash("photo-1506784983877-45594efa4cbe"),
    accent: "mint",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? "Stationery";
}