export const SITE_NAME = "CampusCart";

export const FREE_DELIVERY_THRESHOLD = 499; // ₹
export const DELIVERY_CHARGE = 49; // ₹

export const STORAGE_KEYS = {
  cart: "campuscart_cart",
  wishlist: "campuscart_wishlist",
  orders: "campuscart_orders",
  user: "campuscart_user",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop#categories" },
  { label: "My Orders", href: "/orders" },
] as const;

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";