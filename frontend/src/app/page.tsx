import { BundleBanner } from "@/components/home/BundleBanner";
import { CategoryCard } from "@/components/home/CategoryCard";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductSection } from "@/components/home/ProductSection";
import { WhyShop } from "@/components/home/WhyShop";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/services/productService";
import { getUnitPrice } from "@/lib/utils";

export default function HomePage() {
  const all = getAllProducts();

  const bestsellers = [...all]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 4);
  const usedIds = new Set(bestsellers.map((p) => p.id));

  const favourites = all
    .filter((p) => (p.rating ?? 0) >= 4.7 && !usedIds.has(p.id))
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 4);
  favourites.forEach((p) => usedIds.add(p.id));

  const budget = all
    .filter((p) => getUnitPrice(p) <= 200 && !usedIds.has(p.id))
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 4);

  const countFor = (slug: string) =>
    all.filter((p) => p.category === slug).length;

  return (
    <>
      <HeroSection />

      <section className="container-page py-12 lg:py-16">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by Category"
          subtitle="Find exactly what you need for lectures, labs and exams."
          actionHref="/shop"
          actionLabel="View all products"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={countFor(category.slug)}
            />
          ))}
        </div>
      </section>

      <ProductSection
        tinted
        eyebrow="Most loved"
        title="Bestselling Products"
        subtitle="What students are adding to their carts the most."
        products={bestsellers}
        actionHref="/shop"
        actionLabel="Shop all"
      />

      <ProductSection
        eyebrow="Top rated"
        title="Student Favourites"
        subtitle="Highly rated picks from students like you."
        products={favourites}
        actionHref="/shop"
        actionLabel="See more"
      />

      <BundleBanner />

      <ProductSection
        tinted
        eyebrow="Under ₹200"
        title="Budget-Friendly Stationery"
        subtitle="Quality essentials that go easy on your pocket money."
        products={budget}
        actionHref="/shop?maxPrice=200"
        actionLabel="Shop budget picks"
      />

      <FeaturedCollections />
      <WhyShop />
      <NewsletterSection />
    </>
  );
}