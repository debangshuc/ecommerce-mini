import { Suspense } from "react";
import type { Metadata } from "next";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ShopContent } from "@/components/product/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse notebooks, pens, art supplies, calculators and student kits.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center py-32">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}