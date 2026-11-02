"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { getProductsByIds } from "@/services/productService";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WishlistCard } from "@/components/product/WishlistCard";

export default function WishlistPage() {
  const { wishlistIds, isHydrated } = useWishlist();

  if (!isHydrated) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" label="Loading your wishlist" />
      </div>
    );
  }

  const products = getProductsByIds(wishlistIds);

  if (products.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          actionLabel="Browse Products"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          My Wishlist{" "}
          <span className="text-xl font-medium text-ink-muted">
            ({products.length})
          </span>
        </h1>
        <Button href="/shop" variant="outline" size="sm">
          Continue Shopping
        </Button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {products.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}