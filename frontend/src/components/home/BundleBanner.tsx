import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { getProductsByIds } from "@/services/productService";
import { formatPrice, getDiscountPercent, getUnitPrice } from "@/lib/utils";

export function BundleBanner() {
  const kits = getProductsByIds(["24", "25"]);
  if (kits.length === 0) return null;

  const bestSaving = Math.max(
    0,
    ...kits.map((kit) => getDiscountPercent(kit.price, kit.discountedPrice))
  );
  const lowestPrice = Math.min(...kits.map(getUnitPrice));

  return (
    <section className="container-page py-8">
      <div className="grid overflow-hidden rounded-3xl bg-lavender-700 text-white md:grid-cols-2">
        <div className="p-8 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-lavender-200">
            Student Stationery Bundles
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            Start the semester with everything in one box.
          </h2>
          <p className="mt-4 max-w-md text-lavender-100">
            Hand-picked kits for freshers and hostel life, from {formatPrice(lowestPrice)}
            {bestSaving > 0 && <> and save up to {bestSaving}%</>}.
          </p>
          <Button
            href="/shop?category=student-kits"
            variant="outline"
            size="lg"
            className="mt-8"
            rightIcon={<ArrowRight size={18} />}
          >
            Shop Bundles
          </Button>
        </div>

        <div className="grid gap-4 bg-lavender-600/40 p-6 sm:p-10">
          {kits.map((kit) => (
            <Link
              key={kit.id}
              href={`/product/${kit.id}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-3 text-ink transition-transform hover:-translate-y-0.5"
            >
              <ProductImage
                src={kit.image}
                alt={kit.name}
                sizes="96px"
                className="h-20 w-20 shrink-0 rounded-xl"
              />
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold">{kit.name}</p>
                <p className="mt-1 text-lg font-bold text-lavender-700">
                  {formatPrice(getUnitPrice(kit))}
                  {kit.discountedPrice !== undefined && (
                    <span className="ml-2 text-sm font-medium text-ink-muted line-through">
                      {formatPrice(kit.price)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}