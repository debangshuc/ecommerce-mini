"use client";

import { useState } from "react";
import { ChevronDown, CreditCard, MapPin } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-sky-100 text-sky-500",
  Shipped: "bg-lavender-100 text-lavender-700",
  "Out for Delivery": "bg-peach-100 text-peach-600",
  Delivered: "bg-mint-100 text-mint-600",
  Cancelled: "bg-cream-dark text-ink-soft",
};

export function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const previewItems = order.items.slice(0, 3);
  const extra = order.items.length - previewItems.length;
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <article className="card-soft overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-dark/50 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Order ID
          </p>
          <p className="font-bold">{order.id}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Placed on
          </p>
          <p className="font-semibold">{formatDate(order.date)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Total
          </p>
          <p className="font-bold text-lavender-700">{formatPrice(order.total)}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold",
            statusStyles[order.status]
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {previewItems.map((item) => (
              <ProductImage
                key={item.productId}
                src={item.image}
                alt={item.name}
                sizes="56px"
                className="h-14 w-14 rounded-xl border-2 border-white"
              />
            ))}
          </div>
          <p className="text-sm text-ink-soft">
            {itemCount} {itemCount === 1 ? "item" : "items"}
            {extra > 0 && ` (+${extra} more product${extra > 1 ? "s" : ""})`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          rightIcon={
            <ChevronDown
              size={16}
              className={cn("transition-transform", open && "rotate-180")}
            />
          }
        >
          {open ? "Hide details" : "View details"}
        </Button>
      </div>

      {open && (
        <div className="space-y-6 border-t border-line p-5">
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-3">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  sizes="64px"
                  className="h-16 w-16 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-ink-muted">
                    Qty {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2 text-ink-soft">
                <MapPin size={16} className="mt-0.5 shrink-0 text-lavender-600" />
                {order.shippingAddress}
              </p>
              <p className="flex items-center gap-2 text-ink-soft">
                <CreditCard size={16} className="shrink-0 text-lavender-600" />
                {order.paymentMethod}
              </p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-semibold">
                  {order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-lavender-700">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </article>
  );
}