"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCart, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { getCategoryName } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/product/ProductImage";

export function WishlistCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="card-soft flex flex-col overflow-hidden sm:flex-row">
      <Link
        href={`/product/${product.id}`}
        className="block shrink-0 sm:w-44"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, 176px"
          className="aspect-square w-full sm:h-full"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          {getCategoryName(product.category)}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="font-semibold leading-snug hover:text-lavender-700"
        >
          {product.name}
        </Link>
        <PriceDisplay
          price={product.price}
          discountedPrice={product.discountedPrice}
          showPercent
        />
        {outOfStock && (
          <p className="text-xs font-semibold text-peach-600">Currently out of stock</p>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-3">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={outOfStock}
            variant={added ? "secondary" : "primary"}
            leftIcon={added ? <Check size={16} /> : <ShoppingCart size={16} />}
          >
            {added ? "Added" : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeFromWishlist(product.id)}
            leftIcon={<Trash2 size={16} />}
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}