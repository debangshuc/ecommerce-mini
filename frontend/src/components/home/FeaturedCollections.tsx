import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Palette, type LucideIcon } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImage } from "@/components/product/ProductImage";

interface Collection {
  title: string;
  description: string;
  slug: string;
  icon: LucideIcon;
  tone: string;
}

const collections: Collection[] = [
  {
    title: "Exam Season Ready",
    description: "Exam pads, pens and everything for the hall.",
    slug: "exam-essentials",
    icon: BookOpen,
    tone: "bg-peach-100",
  },
  {
    title: "Maths & Science Corner",
    description: "Scientific calculators for lectures and labs.",
    slug: "calculators",
    icon: Calculator,
    tone: "bg-sky-100",
  },
  {
    title: "Art & Project Week",
    description: "Paints, pastels and sketch pads for creative work.",
    slug: "art-craft",
    icon: Palette,
    tone: "bg-mint-100",
  },
];

export function FeaturedCollections() {
  return (
    <section className="container-page py-12 lg:py-16">
      <SectionHeading
        eyebrow="Curated for you"
        title="Featured Collections"
        subtitle="Shop by what's happening on campus right now."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {collections.map(({ title, description, slug, icon: Icon, tone }) => {
          const image = getCategoryBySlug(slug)?.image ?? PLACEHOLDER_IMAGE;
          return (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className={`group overflow-hidden rounded-3xl ${tone} transition-all duration-300 hover:-translate-y-1 hover:shadow-lift`}
            >
              <ProductImage
                src={image}
                alt={title}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-[16/10] w-full"
                imageClassName="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-lavender-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-700 group-hover:gap-2.5">
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}