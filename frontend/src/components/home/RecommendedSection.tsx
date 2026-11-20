"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { INTERESTS, getRecommendedProducts } from "@/data/interests";
import { useAuth } from "@/context/AuthContext";
import { getAllProducts } from "@/services/productService";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

export function RecommendedSection() {
  const { user, isHydrated } = useAuth();

  const interests = useMemo(() => user?.interests ?? [], [user]);
  const recommended = useMemo(
    () => getRecommendedProducts(getAllProducts(), interests, 4),
    [interests]
  );

  if (!isHydrated) return null;

  if (recommended.length > 0) {
    const chosen = INTERESTS.filter((interest) => interests.includes(interest.id));
    return (
      <section className="container-page py-10 lg:py-14">
        <SectionHeading
          eyebrow="Just for you"
          title="Picked for You"
          subtitle="Recommendations based on the interests you selected."
          actionHref="/profile#interests"
          actionLabel="Edit interests"
        />
        <ul className="mt-5 flex flex-wrap gap-2">
          {chosen.map((interest) => (
            <li
              key={interest.id}
              className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-semibold text-lavender-700"
            >
              {interest.label}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-lavender-50 p-8 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-lavender-600">
            <Sparkles size={24} />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Get a feed made for you</h2>
            <p className="mt-1 max-w-lg text-ink-soft">
              Tell us what you study or love, such as Engineering, Art,
              Architecture or exam prep, and we&apos;ll show the stationery
              that fits.
            </p>
          </div>
        </div>
        {user ? (
          <Button href="/profile#interests">Choose your interests</Button>
        ) : (
          <div className="flex gap-3">
            <Button href="/signup">Sign up &amp; pick interests</Button>
            <Button href="/login" variant="outline">
              Log in
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}