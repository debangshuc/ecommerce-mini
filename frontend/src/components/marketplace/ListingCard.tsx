"use client";

import { CheckCircle2, MapPin, MessageCircle, RotateCcw, Trash2 } from "lucide-react";
import type { Listing, ListingCondition } from "@/types/marketplace";
import { getListingCategoryLabel } from "@/data/listings";
import { cn, formatDate, formatPrice, getDiscountPercent } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";

const conditionStyles: Record<ListingCondition, string> = {
  New: "bg-mint-100 text-mint-600",
  "Like New": "bg-sky-100 text-sky-500",
  Good: "bg-lavender-100 text-lavender-700",
  Fair: "bg-peach-100 text-peach-600",
};

interface ListingCardProps {
  listing: Listing;
  isOwner: boolean;
  onContact: (listing: Listing) => void;
  onToggleSold: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ListingCard({
  listing,
  isOwner,
  onContact,
  onToggleSold,
  onDelete,
}: ListingCardProps) {
  const percentOff = listing.originalPrice
    ? getDiscountPercent(listing.originalPrice, listing.price)
    : 0;

  const handleDelete = () => {
    if (window.confirm("Delete this listing? This can't be undone.")) {
      onDelete(listing.id);
    }
  };

  return (
    <article className="card-soft flex h-full flex-col overflow-hidden">
      <div className="relative">
        <ProductImage
          src={listing.image}
          alt={listing.title}
          className="aspect-[4/3] w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold",
            conditionStyles[listing.condition]
          )}
        >
          {listing.condition}
        </span>
        {isOwner && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">
            Your listing
          </span>
        )}
        {listing.sold && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <span className="rounded-full bg-ink px-4 py-1.5 text-sm font-bold text-white">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          {getListingCategoryLabel(listing.category)}
        </p>
        <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug">
          {listing.title}
        </h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{listing.description}</p>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl font-bold">{formatPrice(listing.price)}</span>
          {listing.originalPrice !== undefined && listing.originalPrice > listing.price && (
            <>
              <span className="text-sm text-ink-muted line-through">
                {formatPrice(listing.originalPrice)}
              </span>
              <span className="rounded-full bg-mint-100 px-2 py-0.5 text-xs font-bold text-mint-600">
                {percentOff}% off new
              </span>
            </>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">
            {listing.college}, {listing.city}
          </span>
        </p>
        <p className="text-xs text-ink-muted">
          {isOwner ? "You" : listing.sellerName} · Listed {formatDate(listing.postedAt)}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {isOwner ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onToggleSold(listing.id)}
                leftIcon={
                  listing.sold ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />
                }
              >
                {listing.sold ? "Mark available" : "Mark as sold"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                leftIcon={<Trash2 size={14} />}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              fullWidth
              disabled={listing.sold}
              onClick={() => onContact(listing)}
              leftIcon={<MessageCircle size={16} />}
            >
              {listing.sold ? "Sold" : "Contact seller"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}