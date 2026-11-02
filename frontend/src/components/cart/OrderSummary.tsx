import type { ReactNode } from "react";
import type { CartItem as CartLine } from "@/types/cart";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { formatPrice, getUnitPrice } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";

interface OrderSummaryProps {
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
  items?: CartLine[];
  children?: ReactNode;
}

export function OrderSummary({
  subtotal,
  deliveryCharge,
  total,
  itemCount,
  items,
  children,
}: OrderSummaryProps) {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
      <h2 className="font-sans text-lg font-bold">Order summary</h2>

      {items && items.length > 0 && (
        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-3">
              <ProductImage
                src={product.image}
                alt={product.name}
                sizes="56px"
                className="h-14 w-14 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-ink-muted">Qty {quantity}</p>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(getUnitPrice(product) * quantity)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="font-semibold">
            {deliveryCharge === 0 ? (
              <span className="text-mint-600">Free</span>
            ) : (
              formatPrice(deliveryCharge)
            )}
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="text-xl font-bold text-lavender-700">{formatPrice(total)}</dd>
        </div>
      </dl>

      {subtotal > 0 && remaining > 0 && (
        <div className="mt-5 rounded-2xl bg-lavender-50 p-4">
          <p className="text-xs font-medium text-ink-soft">
            Add{" "}
            <strong className="text-lavender-700">{formatPrice(remaining)}</strong>{" "}
            more for free delivery
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavender-200">
            <div
              className="h-full rounded-full bg-lavender-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {children && <div className="mt-6 space-y-3">{children}</div>}
    </div>
  );
}