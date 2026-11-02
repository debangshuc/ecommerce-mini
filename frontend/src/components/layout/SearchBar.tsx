"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: () => void;
}

export function SearchBar({
  className,
  placeholder = "Search notebooks, pens, calculators…",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
    onSearch?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-white pl-5 pr-12 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-lavender-600 text-white transition-colors hover:bg-lavender-700"
      >
        <Search size={16} />
      </button>
    </form>
  );
}