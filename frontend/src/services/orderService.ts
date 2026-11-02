import { mockOrders } from "@/data/orders";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Order } from "@/types/order";

function readPlacedOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.orders);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

/** Orders placed in this browser + mock history, newest first. */
export function getOrders(): Order[] {
  return [...readPlacedOrders(), ...mockOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readPlacedOrders();
    window.localStorage.setItem(
      STORAGE_KEYS.orders,
      JSON.stringify([order, ...existing])
    );
  } catch {
    // Storage full or blocked: the order simply won't appear in history.
  }
}

export function generateOrderId(): string {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CC${new Date().getFullYear()}-${random}`;
}