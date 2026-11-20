import { redirect } from "next/navigation";

interface ShopRedirectProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** /shop no longer exists as a page: it forwards to the unified shop on "/". */
export default async function ShopRedirect({ searchParams }: ShopRedirectProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    }
  }

  const qs = query.toString();
  redirect(`/${qs ? `?${qs}` : ""}#shop`);
}