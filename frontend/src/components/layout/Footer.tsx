import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { categories } from "@/data/categories";

const accountLinks = [
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping Cart", href: "/cart" },
  { label: "My Profile", href: "/profile" },
  { label: "Log in", href: "/login" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-cream-dark">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="CampusCart home">
            <Image
              src="/logo.svg"
              alt="CampusCart"
              width={160}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Notebooks, pens, art supplies and study essentials picked for
            students, at prices that suit a student budget.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-lavender-600" />
              support@campuscart.example
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-lavender-600" />
              Delivering across India
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
            Shop
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/shop" className="text-ink-soft hover:text-lavender-700">
                All Products
              </Link>
            </li>
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="text-ink-soft hover:text-lavender-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
            More Categories
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="text-ink-soft hover:text-lavender-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
            Your Account
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-soft hover:text-lavender-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CampusCart. A college project.</p>
          <p>Demo store: no real payments or orders are processed.</p>
        </div>
      </div>
    </footer>
  );
}