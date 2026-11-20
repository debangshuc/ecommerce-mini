import { Suspense } from "react";
import { BundleBanner } from "@/components/home/BundleBanner";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { RecommendedSection } from "@/components/home/RecommendedSection";
import { StudentPerkBanner } from "@/components/home/StudentPerkBanner";
import { WhyShop } from "@/components/home/WhyShop";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ShopContent } from "@/components/product/ShopContent";
import { getAllProducts } from "@/services/productService";

export default function HomePage() {
  const products = getAllProducts();

  return (
    <>
      <HeroSection />
      <StudentPerkBanner />
      <RecommendedSection />
      <FeaturedTabs products={products} />
      <BundleBanner />

      {/* The unified shop: categories, search, filters, sort and listing */}
      <section id="shop" className="scroll-mt-20">
        <Suspense
          fallback={
            <div className="grid min-h-[24rem] place-items-center">
              <LoadingSpinner size="lg" label="Loading shop" />
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </section>

      <FeaturedCollections />
      <WhyShop />
      <NewsletterSection />
    </>
  );
}