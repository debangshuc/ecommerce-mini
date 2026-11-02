import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  actionLabel,
  actionHref,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        centered && "items-center text-center sm:flex-col sm:items-center"
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lavender-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-lavender-700 hover:gap-2.5 hover:text-lavender-600 transition-all"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}