import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductSectionProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  products: Product[];
  tinted?: boolean;
}

export function ProductSection({
  title,
  eyebrow,
  subtitle,
  actionHref,
  actionLabel,
  products,
  tinted = false,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn(tinted && "border-y border-line bg-lavender-50/60")}>
      <div className="container-page py-12 lg:py-16">
        <SectionHeading
          title={title}
          eyebrow={eyebrow}
          subtitle={subtitle}
          actionHref={actionHref}
          actionLabel={actionLabel}
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}