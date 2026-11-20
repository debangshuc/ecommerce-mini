"use client";

import { useState } from "react";
import { CheckCircle2, GraduationCap, MapPin } from "lucide-react";
import type { Listing } from "@/types/marketplace";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/product/ProductImage";

function ContactBody({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const firstName = listing.sellerName.split(" ")[0];
  const [message, setMessage] = useState(
    `Hi ${firstName}, is "${listing.title}" still available?`
  );
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (message.trim().length < 5) {
      setError("Write a short message for the seller.");
      return;
    }
    setError("");
    setSending(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 700));
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-mint-600">
          <CheckCircle2 size={36} />
        </span>
        <h3 className="mt-4 text-xl font-bold">Message sent to {firstName}</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Demo only: nothing was actually sent. In a real build the seller
          would reply in your inbox.
        </p>
        <Button className="mt-6" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl bg-white p-3">
        <ProductImage
          src={listing.image}
          alt={listing.title}
          sizes="80px"
          className="h-20 w-20 shrink-0 rounded-xl"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold">{listing.title}</p>
          <p className="mt-1 text-lg font-bold text-lavender-700">
            {formatPrice(listing.price)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-lavender-50 p-4 text-sm">
        <p className="text-base font-bold">{listing.sellerName}</p>
        <p className="mt-1 flex items-center gap-2 text-ink-soft">
          <GraduationCap size={16} className="text-lavender-600" />
          {listing.college}
        </p>
        <p className="mt-1 flex items-center gap-2 text-ink-soft">
          <MapPin size={16} className="text-lavender-600" />
          {listing.city}
        </p>
      </div>

      <div>
        <label htmlFor="seller-message" className="mb-1.5 block text-sm font-semibold">
          Your message
        </label>
        <textarea
          id="seller-message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-2xl border border-line bg-white p-4 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
        />
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSend} loading={sending}>
          Send message
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface ContactSellerModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export function ContactSellerModal({ listing, onClose }: ContactSellerModalProps) {
  return (
    <Modal open={listing !== null} onClose={onClose} title="Contact seller">
      {listing && <ContactBody key={listing.id} listing={listing} onClose={onClose} />}
    </Modal>
  );
}