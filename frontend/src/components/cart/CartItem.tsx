"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartLine } from "@/types/cart";
import { getCategoryName } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { formatPrice, getUnitPrice } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductImage } from "@/components/product/ProductImage";

export function CartItem({ item }: { item: CartLine }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const unitPrice = getUnitPrice(product);

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <Link href={`/product/${product.id}`} className="shrink-0">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="112px"
          className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {getCategoryName(product.category)}
            </p>
            <Link
              href={`/product/${product.id}`}
              className="line-clamp-2 font-semibold leading-snug hover:text-lavender-700"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-ink-soft">
              {formatPrice(unitPrice)} each
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-peach-100 hover:text-peach-600"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantitySelector
            size="sm"
            value={quantity}
            min={1}
            max={product.stock}
            onChange={(value) => updateQuantity(product.id, value)}
          />
          <p className="text-lg font-bold">{formatPrice(unitPrice * quantity)}</p>
        </div>
      </div>
    </li>
  );
}