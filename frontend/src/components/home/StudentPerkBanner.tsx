"use client";

import { useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPriceInfo } from "@/lib/student";
import { getAllProducts } from "@/services/productService";
import { Button } from "@/components/ui/Button";

export function StudentPerkBanner() {
  const { user, isStudent, isHydrated } = useAuth();

  const maxPercent = useMemo(
    () =>
      Math.max(0, ...getAllProducts().map((p) => getPriceInfo(p, true).percent)),
    []
  );

  if (!isHydrated) return null;

  const firstName = user?.fullName.split(" ")[0];

  if (isStudent) {
    return (
      <div className="container-page pt-6">
        <div className="flex items-center gap-3 rounded-2xl bg-mint-100 px-5 py-4 text-sm text-ink-soft">
          <GraduationCap size={22} className="shrink-0 text-mint-600" />
          <p>
            <strong className="text-mint-600">Student prices unlocked</strong>
            {firstName ? `, ${firstName}` : ""}. Every price below already
            includes your college-email discount.
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container-page pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-peach-100 px-5 py-4 text-sm text-ink-soft">
          <p className="flex items-center gap-3">
            <GraduationCap size={22} className="shrink-0 text-peach-600" />
            <span>
              You&apos;re seeing <strong>regular prices</strong>. Create an
              account with your college email (.edu, .ac.in) to save up to{" "}
              {maxPercent}%.
            </span>
          </p>
          <Button href="/signup" size="sm">
            Get student prices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-lavender-100 px-5 py-4 text-sm text-ink-soft">
        <p className="flex items-center gap-3">
          <GraduationCap size={22} className="shrink-0 text-lavender-600" />
          <span>
            Students save up to <strong>{maxPercent}%</strong>. Sign up or log
            in with your college email to unlock student prices.
          </span>
        </p>
        <div className="flex gap-2">
          <Button href="/login" size="sm" variant="outline">
            Log in
          </Button>
          <Button href="/signup" size="sm">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}