import { products } from "@/data/products";
import type { Product } from "@/types/product";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** Returns products in the same order as the ids passed in. */
export function getProductsByIds(ids: string[]): Product[] {
  const result: Product[] = [];
  for (const id of ids) {
    const product = getProductById(id);
    if (product) result.push(product);
  }
  return result;
}

/** Same-category products first, then other popular products. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const others = products.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others
    .filter((p) => p.category !== product.category)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  return [...sameCategory, ...rest].slice(0, limit);
}