import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, SearchX } from "lucide-react";
import { getCategoryName } from "@/data/categories";
import { getProductById, getRelatedProducts } from "@/services/productService";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetails } from "@/components/product/ProductDetails";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return { title: product ? product.name : "Product not found" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title="Product not found"
          description="This product doesn't exist or may have been removed."
          actionLabel="Back to Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-page py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
          <li>
            <Link href="/" className="hover:text-lavender-700">
              Home
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li>
            <Link href="/shop" className="hover:text-lavender-700">
              Shop
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-lavender-700"
            >
              {getCategoryName(product.category)}
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li aria-current="page" className="line-clamp-1 font-semibold text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetails product={product} />

      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <SectionHeading
            title="Related Products"
            subtitle="Other items students buy with this."
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}