import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = PackageOpen,
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-lavender-100 text-lavender-600">
        <Icon size={36} strokeWidth={1.6} />
      </span>
      <h2 className="mt-6 text-2xl font-bold">{title}</h2>
      {description && <p className="mt-2 text-ink-soft">{description}</p>}
      {actionLabel && actionHref && (
        <Button href={actionHref} className="mt-6">
          {actionLabel}
        </Button>
      )}
      {children && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
      )}
    </div>
  );
}