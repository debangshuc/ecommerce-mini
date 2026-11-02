"use client";

import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasFailed = failedSrc === src;

  return (
    <div className={cn("relative overflow-hidden bg-lavender-50", className)}>
      {hasFailed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-lavender-100 text-lavender-400"
        >
          <Package size={40} strokeWidth={1.4} />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailedSrc(src)}
          className={cn("object-cover", imageClassName)}
        />
      )}
    </div>
  );
}