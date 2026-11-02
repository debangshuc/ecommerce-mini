"use client";

import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";
import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";
import { OrderCard } from "@/components/cart/OrderCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  if (orders === null) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" label="Loading your orders" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          description="When you place an order, it will show up here."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">My Orders</h1>
          <p className="mt-2 text-ink-soft">
            {orders.length} {orders.length === 1 ? "order" : "orders"} in your
            history.
          </p>
        </div>
        <Button href="/shop" variant="outline" size="sm">
          Continue Shopping
        </Button>
      </div>

      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}