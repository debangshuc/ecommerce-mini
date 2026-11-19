export const SITE_NAME = "CampusCart";

export const FREE_DELIVERY_THRESHOLD = 499; // ₹
export const DELIVERY_CHARGE = 49; // ₹

export const STORAGE_KEYS = {
  cart: "campuscart_cart",
  wishlist: "campuscart_wishlist",
  orders: "campuscart_orders",
  user: "campuscart_user",
  accounts: "campuscart_accounts",
  listings: "campuscart_listings",
} as const;

export const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Buy & Sell", href: "/marketplace" },
  { label: "My Orders", href: "/orders" },
] as const;

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";