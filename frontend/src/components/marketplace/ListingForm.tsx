"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { LISTING_CATEGORIES } from "@/data/listings";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { listingSchema, type ListingValues } from "@/lib/validation";
import { LISTING_CONDITIONS, type Listing } from "@/types/marketplace";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProductImage } from "@/components/product/ProductImage";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

/** Reads an image file and shrinks it so it fits comfortably in localStorage. */
async function fileToCompressedDataUrl(file: File, maxSize = 800): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Could not load the image"));
    element.src = original;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return original;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

interface ListingFormProps {
  onDone: () => void;
  onCreated: (listing: Listing) => void;
}

export function ListingForm({ onDone, onCreated }: ListingFormProps) {
  const { user } = useAuth();
  const { addListing } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [processingImage, setProcessingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "textbooks",
      condition: "Good",
    },
  });

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setImageError("That image is too large. Choose one under 8 MB.");
      return;
    }

    setImageError("");
    setProcessingImage(true);
    try {
      setImageData(await fileToCompressedDataUrl(file));
    } catch {
      setImageError("We couldn't read that image. Try another one.");
    } finally {
      setProcessingImage(false);
    }
  };

  const onSubmit = async (values: ListingValues) => {
    if (!user) return;
    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    const defaultAddress =
      user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

    const listing = addListing(
      {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        category: values.category,
        condition: values.condition,
        image: imageData ?? PLACEHOLDER_IMAGE,
      },
      {
        id: user.id,
        name: user.fullName,
        college: user.college || "College not added",
        city: defaultAddress?.city ?? "Your city",
      }
    );
    onCreated(listing);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input
        label="Product name"
        placeholder="e.g. Engineering Mathematics by B.S. Grewal"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label htmlFor="listing-description" className="mb-1.5 block text-sm font-semibold">
          Description
        </label>
        <textarea
          id="listing-description"
          rows={4}
          placeholder="Edition, how much it was used, anything the buyer should know"
          aria-invalid={errors.description ? true : undefined}
          className="w-full rounded-2xl border border-line bg-white p-4 text-sm placeholder:text-ink-muted focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-danger">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Price (₹)"
          inputMode="numeric"
          placeholder="350"
          maxLength={6}
          leftIcon={<span className="text-sm font-bold">₹</span>}
          error={errors.price?.message}
          {...register("price")}
        />
        <Select label="Category" error={errors.category?.message} {...register("category")}>
          {LISTING_CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Condition</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LISTING_CONDITIONS.map((condition) => (
            <label
              key={condition}
              className="flex cursor-pointer items-center justify-center rounded-2xl border border-line bg-white px-3 py-3 text-sm font-semibold transition-colors hover:border-lavender-400 has-[:checked]:border-lavender-500 has-[:checked]:bg-lavender-50 has-[:checked]:text-lavender-700"
            >
              <input
                type="radio"
                value={condition}
                className="sr-only"
                {...register("condition")}
              />
              {condition}
            </label>
          ))}
        </div>
        {errors.condition && (
          <p className="mt-1.5 text-xs text-danger">Choose the item&apos;s condition.</p>
        )}
      </fieldset>

      <div>
        <p className="mb-1.5 text-sm font-semibold">Photo</p>
        {imageData ? (
          <div className="relative w-40">
            <ProductImage
              src={imageData}
              alt="Listing preview"
              sizes="160px"
              className="aspect-square w-40 rounded-2xl border border-line"
            />
            <button
              type="button"
              onClick={() => setImageData(null)}
              aria-label="Remove photo"
              className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-ink text-white shadow-soft"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={processingImage}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-white text-sm text-ink-soft transition-colors hover:border-lavender-400 hover:text-lavender-700 disabled:opacity-60"
          >
            <ImagePlus size={26} />
            {processingImage ? "Processing photo…" : "Click to upload a photo"}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {imageError && <p className="mt-1.5 text-xs text-danger">{imageError}</p>}
        <p className="mt-1.5 text-xs text-ink-muted">
          Optional. Without a photo we show a placeholder. Photos stay in your
          browser only.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          Publish listing
        </Button>
        <Button variant="ghost" size="lg" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}