"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div>
      <ProductImage
        src={current}
        alt={name}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="aspect-square w-full rounded-3xl border border-line"
      />
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === selected}
              className={cn(
                "shrink-0 overflow-hidden rounded-2xl border-2 transition-colors",
                index === selected ? "border-lavender-500" : "border-transparent"
              )}
            >
              <ProductImage
                src={src}
                alt={`${name} thumbnail ${index + 1}`}
                sizes="80px"
                className="h-20 w-20"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}