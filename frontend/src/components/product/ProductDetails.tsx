"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Heart, RotateCcw, ShoppingCart, Star, Truck } from "lucide-react";
import type { Product } from "@/types/product";
import { getCategoryName } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductGallery } from "@/components/product/ProductGallery";

export function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, isHydrated } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const images = [product.image, ...(product.images ?? [])];
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const wished = isHydrated && isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2500);
  };

  const info: { label: string; value: string }[] = [
    { label: "Brand", value: product.brand ?? "Generic" },
    { label: "Category", value: getCategoryName(product.category) },
    { label: "Product code", value: `CC-${product.id.padStart(4, "0")}` },
    {
      label: "Availability",
      value: outOfStock ? "Out of stock" : `${product.stock} units in stock`,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={images} name={product.name} />

      <div>
        <Link
          href={`/shop?category=${product.category}`}
          className="text-xs font-bold uppercase tracking-widest text-lavender-600 hover:underline"
        >
          {getCategoryName(product.category)}
        </Link>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
          {product.name}
        </h1>

        {product.rating !== undefined && (
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <Star size={18} className="fill-peach-500 text-peach-500" />
            <span className="font-bold text-ink">{product.rating.toFixed(1)}</span>
            {product.reviewCount !== undefined && (
              <span>({product.reviewCount} reviews)</span>
            )}
          </div>
        )}

        <PriceDisplay
          className="mt-5"
          price={product.price}
          discountedPrice={product.discountedPrice}
          size="lg"
          showPercent
        />
        <p className="mt-1 text-xs text-ink-muted">Inclusive of all taxes</p>

        <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

        <div className="mt-6">
          {outOfStock ? (
            <span className="inline-flex rounded-full bg-peach-100 px-3 py-1 text-sm font-semibold text-peach-600">
              Out of stock
            </span>
          ) : lowStock ? (
            <span className="inline-flex rounded-full bg-peach-100 px-3 py-1 text-sm font-semibold text-peach-600">
              Hurry, only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-mint-100 px-3 py-1 text-sm font-semibold text-mint-600">
              In stock
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <QuantitySelector
            value={quantity}
            onChange={(value) =>
              setQuantity(Math.max(1, Math.min(value, product.stock || 1)))
            }
            min={1}
            max={Math.max(product.stock, 1)}
            disabled={outOfStock}
          />
          <Button
            size="lg"
            className="flex-1 sm:flex-none"
            disabled={outOfStock}
            onClick={handleAdd}
            leftIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
          >
            {outOfStock ? "Unavailable" : added ? "Added to cart" : "Add to Cart"}
          </Button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border transition-colors",
              wished
                ? "border-peach-200 bg-peach-100 text-peach-600"
                : "border-line bg-white text-ink-soft hover:border-peach-200 hover:text-peach-600"
            )}
          >
            <Heart size={20} fill={wished ? "currentColor" : "none"} />
          </button>
        </div>

        {added && (
          <p role="status" className="mt-3 text-sm font-medium text-mint-600">
            Added to your cart.{" "}
            <Link href="/cart" className="underline">
              View cart
            </Link>
          </p>
        )}

        <ul className="mt-8 space-y-3 rounded-2xl bg-lavender-50 p-5 text-sm text-ink-soft">
          <li className="flex items-center gap-3">
            <Truck size={18} className="text-lavender-600" />
            Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}
          </li>
          <li className="flex items-center gap-3">
            <RotateCcw size={18} className="text-lavender-600" />
            7-day easy returns on unused items
          </li>
        </ul>

        <section className="mt-8">
          <h2 className="font-sans text-lg font-bold">Product information</h2>
          <dl className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {info.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-ink-muted">{row.label}</dt>
                <dd className="text-right font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}