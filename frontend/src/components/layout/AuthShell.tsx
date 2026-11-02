import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const perks = [
  "Save favourites to your wishlist",
  "Track every order in one place",
  "Faster checkout with saved addresses",
  "Student-only offers and bundles",
];

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="container-page py-8 lg:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-lavender-100 p-10 lg:flex">
          <div>
            <Link href="/" aria-label="CampusCart home">
              <Image
                src="/logo.svg"
                alt="CampusCart"
                width={160}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <h2 className="mt-10 text-3xl font-bold leading-tight">
              Everything you need to make your semester better.
            </h2>
            <ul className="mt-8 space-y-4">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-ink-soft">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-200 text-mint-600">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-lavender-700">
            Demo project: login is simulated and no data leaves your browser.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
        </div>
      </div>
    </div>
  );
}