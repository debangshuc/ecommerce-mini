"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { Heart, Menu, ShoppingCart, User } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchBar } from "@/components/layout/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";

interface IconLinkProps {
  href: string;
  label: string;
  count?: number;
  className?: string;
  children: ReactNode;
}

function IconLink({ href, label, count = 0, className, children }: IconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `${label} (${count})` : label}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-lavender-50 hover:text-lavender-700",
        className
      )}
    >
      {children}
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-peach-500 px-1 text-[11px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const { totalItems, isHydrated: cartReady } = useCart();
  const { count: wishlistCount, isHydrated: wishlistReady } = useWishlist();
  const { user, isHydrated: authReady } = useAuth();
  const loggedIn = authReady && user !== null;

  const isActive = (href: string): boolean => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-lavender-50 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link href="/" aria-label="CampusCart home" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="CampusCart"
              width={160}
              height={40}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav
            className="ml-4 hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-lavender-100 text-lavender-700"
                    : "text-ink-soft hover:bg-lavender-50 hover:text-lavender-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden w-full max-w-xs md:block xl:max-w-sm">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center md:ml-0">
            <IconLink
              href="/wishlist"
              label="Wishlist"
              count={wishlistReady ? wishlistCount : 0}
              className="hidden sm:grid"
            >
              <Heart size={21} />
            </IconLink>
            <IconLink
              href={loggedIn ? "/profile" : "/login"}
              label={loggedIn ? "My account" : "Log in"}
              className="hidden sm:grid"
            >
              <User size={21} />
            </IconLink>
            <IconLink
              href="/cart"
              label="Shopping cart"
              count={cartReady ? totalItems : 0}
            >
              <ShoppingCart size={21} />
            </IconLink>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </header>
  );
}