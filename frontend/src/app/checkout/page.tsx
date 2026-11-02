"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShoppingBag,
  Smartphone,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { INDIAN_STATES } from "@/lib/india";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation";
import { formatPrice, getUnitPrice } from "@/lib/utils";
import { generateOrderId, saveOrder } from "@/services/orderService";
import type { Order } from "@/types/order";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";

const PAYMENT_OPTIONS: {
  value: CheckoutValues["payment"];
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  { value: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { value: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { value: "netbanking", label: "Net Banking", hint: "All major banks", icon: Landmark },
  { value: "cod", label: "Cash on Delivery", hint: "Pay when it arrives", icon: Banknote },
];

export default function CheckoutPage() {
  const { items, totalItems, subtotal, deliveryCharge, total, clearCart, isHydrated } =
    useCart();
  const { user } = useAuth();
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const prefilled = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      payment: "upi",
    },
  });

  // Prefill from the logged-in demo user (once).
  useEffect(() => {
    if (!user || prefilled.current) return;
    prefilled.current = true;
    const address =
      user.addresses.find((a) => a.isDefault) ?? user.addresses[0];
    reset({
      ...getValues(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: address?.line1 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      pincode: address?.pincode ?? "",
    });
  }, [user, reset, getValues]);

  const onSubmit = async (values: CheckoutValues) => {
    // Simulated processing: no real payment or backend call happens.
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    const paymentLabel =
      PAYMENT_OPTIONS.find((o) => o.value === values.payment)?.label ??
      "Cash on Delivery";

    const order: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "Processing",
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: getUnitPrice(product),
        quantity,
      })),
      subtotal,
      deliveryCharge,
      total,
      paymentMethod: paymentLabel,
      shippingAddress: `${values.address}, ${values.city}, ${values.state} – ${values.pincode}`,
    };

    saveOrder(order);
    setDeliveryEstimate(
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
    clearCart();
    setPlacedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isHydrated) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ---------- Confirmation screen ----------
  if (placedOrder) {
    return (
      <div className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft sm:p-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint-100 text-mint-600">
            <CheckCircle2 size={44} />
          </span>
          <h1 className="mt-6 text-3xl font-bold">Order placed!</h1>
          <p className="mt-2 text-ink-soft">
            Thank you for shopping with CampusCart. This is a demo order, so
            nothing was charged.
          </p>

          <dl className="mt-8 space-y-3 rounded-2xl bg-lavender-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Order ID</dt>
              <dd className="font-bold">{placedOrder.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Total paid</dt>
              <dd className="font-bold text-lavender-700">
                {formatPrice(placedOrder.total)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Payment</dt>
              <dd className="font-semibold">{placedOrder.paymentMethod}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Estimated delivery</dt>
              <dd className="font-semibold">{deliveryEstimate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-soft">Delivering to</dt>
              <dd className="text-right font-semibold">{placedOrder.shippingAddress}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/orders" size="lg">
              View My Orders
            </Button>
            <Button href="/shop" size="lg" variant="outline">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Empty cart ----------
  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Add a few items to your cart before checking out."
          actionLabel="Browse Products"
          actionHref="/shop"
        />
      </div>
    );
  }

  // ---------- Checkout form ----------
  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-ink-soft">
        Enter your delivery details. This is a demo, so no real payment is taken.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-8"
        >
          <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h2 className="font-sans text-lg font-bold">1. Contact details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Full name"
                  autoComplete="name"
                  placeholder="Aarav Sharma"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
              </div>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@college.edu"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Phone number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9876543210"
                maxLength={10}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h2 className="font-sans text-lg font-bold">2. Delivery address</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Address"
                  autoComplete="street-address"
                  placeholder="Room / flat no., building, street"
                  error={errors.address?.message}
                  {...register("address")}
                />
              </div>
              <Input
                label="City"
                autoComplete="address-level2"
                placeholder="Pune"
                error={errors.city?.message}
                {...register("city")}
              />
              <Select
                label="State"
                autoComplete="address-level1"
                error={errors.state?.message}
                {...register("state")}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              <Input
                label="PIN code"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="411001"
                maxLength={6}
                error={errors.pincode?.message}
                {...register("pincode")}
              />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sky-100 p-4 text-sm text-ink-soft">
              <Truck size={20} className="mt-0.5 shrink-0 text-sky-500" />
              <p>
                Delivery in 2–4 working days across India. Free delivery on
                orders above ₹499, otherwise a flat ₹49.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h2 className="font-sans text-lg font-bold">3. Payment method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map(({ value, label, hint, icon: Icon }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-lavender-400 has-[:checked]:border-lavender-500 has-[:checked]:bg-lavender-50"
                >
                  <input
                    type="radio"
                    value={value}
                    className="h-4 w-4 accent-lavender-600"
                    {...register("payment")}
                  />
                  <Icon size={22} className="shrink-0 text-lavender-600" />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-ink-muted">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              Demo only: no payment details are collected and no real payment
              is processed.
            </p>
          </section>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            total={total}
            itemCount={totalItems}
          >
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              {isSubmitting ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
            </Button>
            <Button href="/cart" variant="ghost" fullWidth>
              Back to cart
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}