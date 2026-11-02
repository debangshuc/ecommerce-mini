import { products } from "@/data/products";
import { calculateDelivery, getUnitPrice } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@/types/order";

function item(productId: string, quantity: number): OrderItem {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Mock order references a missing product: ${productId}`);
  }
  return {
    productId,
    name: product.name,
    image: product.image,
    price: getUnitPrice(product),
    quantity,
  };
}

function buildOrder(
  id: string,
  date: string,
  status: OrderStatus,
  items: OrderItem[],
  paymentMethod: string
): Order {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = calculateDelivery(subtotal);
  return {
    id,
    date,
    status,
    items,
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
    paymentMethod,
    shippingAddress:
      "Room 214, Sunrise Boys Hostel, MG Road, Pune, Maharashtra – 411001",
  };
}

export const mockOrders: Order[] = [
  buildOrder(
    "CC2026-48213",
    "2026-10-28T10:15:00.000Z",
    "Processing",
    [item("1", 2), item("4", 1)],
    "UPI"
  ),
  buildOrder(
    "CC2026-47730",
    "2026-10-22T14:40:00.000Z",
    "Shipped",
    [item("18", 1), item("6", 1)],
    "Credit / Debit Card"
  ),
  buildOrder(
    "CC2026-45102",
    "2026-10-05T09:05:00.000Z",
    "Delivered",
    [item("24", 1), item("10", 2)],
    "UPI"
  ),
  buildOrder(
    "CC2026-41877",
    "2026-09-14T17:30:00.000Z",
    "Delivered",
    [item("8", 1), item("9", 1)],
    "Cash on Delivery"
  ),
  buildOrder(
    "CC2026-40219",
    "2026-09-02T11:20:00.000Z",
    "Cancelled",
    [item("16", 1)],
    "Net Banking"
  ),
];