"use client";

import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";

export default function CartPage() {
  const { items, totalItems, subtotal, deliveryCharge, total, isHydrated, clearCart } =
    useCart();

  if (!isHydrated) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" label="Loading your cart" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's find some stationery for your semester."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Shopping Cart{" "}
          <span className="text-xl font-medium text-ink-muted">
            ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          leftIcon={<Trash2 size={16} />}
        >
          Clear cart
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <ul className="divide-y divide-line rounded-3xl border border-line bg-white px-5 shadow-soft sm:px-6">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            total={total}
            itemCount={totalItems}
          >
            <Button
              href="/checkout"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight size={18} />}
            >
              Proceed to Checkout
            </Button>
            <Button href="/shop" variant="outline" fullWidth>
              Continue Shopping
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}