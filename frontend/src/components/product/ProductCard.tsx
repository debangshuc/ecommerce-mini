"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { getCategoryName } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { getDiscountPercent } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/product/WishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const discount = getDiscountPercent(product.price, product.discountedPrice);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="card-soft group flex h-full flex-col overflow-hidden hover:-translate-y-1">
      <div className="relative">
        <Link
          href={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            className="aspect-square w-full"
            imageClassName="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && !outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-peach-500 px-2.5 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}

        <WishlistButton
          productId={product.id}
          size="sm"
          className="absolute right-3 top-3"
        />

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          {getCategoryName(product.category)}
        </p>

        <Link href={`/product/${product.id}`}>
          <p className="min-h-[2.75rem] line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors hover:text-lavender-700">
            {product.name}
          </p>
        </Link>

        {product.rating !== undefined && (
          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <Star size={14} className="fill-peach-500 text-peach-500" />
            <span className="font-semibold text-ink">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount !== undefined && (
              <span>({product.reviewCount})</span>
            )}
          </div>
        )}

        {lowStock && (
          <p className="text-xs font-semibold text-peach-600">
            Only {product.stock} left
          </p>
        )}

        <div className="mt-auto space-y-3 pt-2">
          <PriceDisplay
            price={product.price}
            discountedPrice={product.discountedPrice}
            size="md"
          />
          <Button
            size="sm"
            fullWidth
            variant={added ? "secondary" : "primary"}
            disabled={outOfStock}
            onClick={handleAddToCart}
            leftIcon={added ? <Check size={16} /> : <ShoppingCart size={16} />}
          >
            {outOfStock ? "Unavailable" : added ? "Added" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
}