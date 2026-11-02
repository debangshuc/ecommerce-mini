"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, MapPin, Pencil, Plus, Star, Trash2, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { INDIAN_STATES } from "@/lib/india";
import {
  addressSchema,
  profileSchema,
  type AddressValues,
  type ProfileValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";

/* ---------- Edit profile form ---------- */
function ProfileForm({ user, onDone }: { user: User; onDone: () => void }) {
  const { updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone,
      college: user.college ?? "",
    },
  });

  const onSubmit = (values: ProfileValues) => {
    updateProfile(values);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        <Input
          label="Phone number"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <div className="sm:col-span-2">
          <Input
            label="College / University"
            placeholder="Your college name"
            error={errors.college?.message}
            {...register("college")}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit">Save changes</Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/* ---------- Add address form ---------- */
function AddressForm({ user, onDone }: { user: User; onDone: () => void }) {
  const { addAddress } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      fullName: user.fullName,
      phone: user.phone,
      line1: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const onSubmit = (values: AddressValues) => {
    addAddress(values);
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-5 space-y-5 rounded-2xl bg-lavender-50 p-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Address name" placeholder="Hostel, Home…" error={errors.label?.message} {...register("label")} />
        <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        <Input
          label="Phone"
          inputMode="numeric"
          maxLength={10}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input label="City" error={errors.city?.message} {...register("city")} />
        <div className="sm:col-span-2">
          <Input
            label="Address"
            placeholder="Room / flat no., building, street"
            error={errors.line1?.message}
            {...register("line1")}
          />
        </div>
        <Select label="State" error={errors.state?.message} {...register("state")}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <Input
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          error={errors.pincode?.message}
          {...register("pincode")}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit">Save address</Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/* ---------- Small on/off switch ---------- */
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-lavender-600" : "bg-line"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-all",
            checked ? "left-6" : "left-1"
          )}
        />
      </button>
    </div>
  );
}

/* ---------- Page ---------- */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isHydrated, logout, removeAddress, setDefaultAddress } = useAuth();
  const [editing, setEditing] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [settings, setSettings] = useState({
    orderEmails: true,
    offers: false,
    sms: true,
  });

  if (!isHydrated) {
    return (
      <div className="grid place-items-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={UserIcon}
          title="You're not logged in"
          description="Log in to view your profile, saved addresses and account settings."
        >
          <Button href="/login">Log in</Button>
          <Button href="/signup" variant="outline">
            Sign up
          </Button>
        </EmptyState>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-lavender-500 text-xl font-bold text-white">
            {initials || "S"}
          </span>
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-ink-soft">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button href="/orders" variant="outline">
            My Orders
          </Button>
          <Button
            variant="secondary"
            onClick={handleLogout}
            leftIcon={<LogOut size={16} />}
          >
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Personal information */}
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-lg font-bold">Personal information</h2>
            {!editing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                leftIcon={<Pencil size={14} />}
              >
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <div className="mt-5">
              <ProfileForm user={user} onDone={() => setEditing(false)} />
            </div>
          ) : (
            <dl className="mt-5 divide-y divide-line text-sm">
              {[
                { label: "Full name", value: user.fullName },
                { label: "Email", value: user.email },
                { label: "Contact number", value: user.phone || "Not added yet" },
                { label: "College", value: user.college || "Not added yet" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-muted">{row.label}</dt>
                  <dd className="text-right font-semibold">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Account settings */}
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <h2 className="font-sans text-lg font-bold">Account settings</h2>
          <div className="mt-2 divide-y divide-line">
            <Toggle
              label="Order updates by email"
              description="Confirmation and delivery status emails."
              checked={settings.orderEmails}
              onChange={(value) => setSettings((s) => ({ ...s, orderEmails: value }))}
            />
            <Toggle
              label="Offers and newsletters"
              description="Student deals and new bundles."
              checked={settings.offers}
              onChange={(value) => setSettings((s) => ({ ...s, offers: value }))}
            />
            <Toggle
              label="SMS delivery alerts"
              description="Text messages when your order is out for delivery."
              checked={settings.sms}
              onChange={(value) => setSettings((s) => ({ ...s, sms: value }))}
            />
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Demo only: these switches are not saved anywhere.
          </p>
        </section>

        {/* Addresses */}
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-lg font-bold">Saved delivery addresses</h2>
            {!addingAddress && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAddingAddress(true)}
                leftIcon={<Plus size={14} />}
              >
                Add address
              </Button>
            )}
          </div>

          {addingAddress && (
            <AddressForm user={user} onDone={() => setAddingAddress(false)} />
          )}

          {user.addresses.length === 0 && !addingAddress ? (
            <p className="mt-5 rounded-2xl bg-lavender-50 p-5 text-sm text-ink-soft">
              No saved addresses yet. Add one to speed up checkout, or{" "}
              <Link href="/shop" className="font-semibold text-lavender-700 underline">
                keep shopping
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {user.addresses.map((address) => (
                <li
                  key={address.id}
                  className={cn(
                    "rounded-2xl border p-5",
                    address.isDefault
                      ? "border-lavender-400 bg-lavender-50"
                      : "border-line bg-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-bold">
                      <MapPin size={16} className="text-lavender-600" />
                      {address.label}
                    </p>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-lavender-600 px-2.5 py-0.5 text-xs font-bold text-white">
                        <Star size={12} fill="currentColor" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{address.fullName}</p>
                  <p className="text-sm text-ink-soft">
                    {address.line1}, {address.city}, {address.state} –{" "}
                    {address.pincode}
                  </p>
                  <p className="text-sm text-ink-soft">Phone: {address.phone}</p>
                  <div className="mt-4 flex gap-2">
                    {!address.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Set as default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAddress(address.id)}
                      leftIcon={<Trash2 size={14} />}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}