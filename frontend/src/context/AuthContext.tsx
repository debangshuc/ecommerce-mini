"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { isCollegeEmail } from "@/lib/student";
import type { Address, User } from "@/types/user";

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface SignupDetails {
  fullName: string;
  email: string;
  phone: string;
  interests: string[];
}

type EditableProfile = Pick<User, "fullName" | "phone" | "college">;

interface AuthContextValue {
  user: User | null;
  isHydrated: boolean;
  /** true when logged in with a college email (.edu, .ac.in …) */
  isStudent: boolean;
  login: (email: string, remember: boolean) => Promise<AuthResult>;
  signup: (details: SignupDetails) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (data: Partial<EditableProfile>) => void;
  updateInterests: (interests: string[]) => void;
  addAddress: (address: Omit<Address, "id" | "isDefault">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const u = value as Partial<User>;
  return (
    typeof u.id === "string" &&
    typeof u.fullName === "string" &&
    typeof u.email === "string" &&
    Array.isArray(u.addresses)
  );
}

/** Older saved users may not have an interests list yet. */
function normalizeUser(user: User): User {
  return {
    ...user,
    interests: Array.isArray(user.interests)
      ? user.interests.filter((i): i is string => typeof i === "string")
      : [],
  };
}

/** Mock "registered accounts" so a returning email gets its data back. */
function readAccounts(): Record<string, User> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.accounts);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const result: Record<string, User> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isUser(value)) result[key] = normalizeUser(value);
    }
    return result;
  } catch {
    return {};
  }
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Student";
  return (
    local
      .replace(/[._-]+/g, " ")
      .replace(/\d+/g, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Student"
  );
}

function createDemoUser(email: string): User {
  const fullName = nameFromEmail(email);
  return {
    id: `u-${Date.now()}`,
    fullName,
    email,
    phone: "9876543210",
    phoneVerified: true,
    college: "Your College",
    interests: [],
    addresses: [
      {
        id: "addr-hostel",
        label: "Hostel",
        fullName,
        phone: "9876543210",
        line1: "Room 214, Sunrise Boys Hostel, MG Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        isDefault: true,
      },
      {
        id: "addr-home",
        label: "Home",
        fullName,
        phone: "9876543210",
        line1: "12, Lake View Apartments, Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560034",
      },
    ],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [remember, setRemember] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const local = window.localStorage.getItem(STORAGE_KEYS.user);
      const session = window.sessionStorage.getItem(STORAGE_KEYS.user);
      const raw = local ?? session;
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isUser(parsed)) {
          setUser(normalizeUser(parsed));
          setRemember(local !== null);
        }
      }
    } catch {
      // Ignore corrupt or unavailable storage.
    }
    setIsHydrated(true);
  }, []);

  // Keep the current session user saved.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const primary = remember ? window.localStorage : window.sessionStorage;
      const other = remember ? window.sessionStorage : window.localStorage;
      if (user) {
        primary.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        other.removeItem(STORAGE_KEYS.user);
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.user);
        window.sessionStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch {
      // Ignore storage errors.
    }
  }, [user, remember, isHydrated]);

  // Keep the mock "account" for this email up to date.
  useEffect(() => {
    if (!isHydrated || !user) return;
    try {
      const accounts = readAccounts();
      accounts[user.email.toLowerCase()] = user;
      window.localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
    } catch {
      // Ignore storage errors.
    }
  }, [user, isHydrated]);

  const login = useCallback(async (email: string, rememberMe: boolean) => {
    await wait(700); // pretend to talk to a server
    const key = email.trim().toLowerCase();
    const existing = readAccounts()[key];
    setRemember(rememberMe);
    setUser(existing ?? createDemoUser(key));
    return { ok: true };
  }, []);

  const signup = useCallback(async (details: SignupDetails) => {
    await wait(900);
    setRemember(true);
    setUser({
      id: `u-${Date.now()}`,
      fullName: details.fullName,
      email: details.email.trim().toLowerCase(),
      phone: details.phone,
      phoneVerified: true,
      college: "",
      interests: details.interests,
      addresses: [],
    });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<EditableProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const updateInterests = useCallback((interests: string[]) => {
    setUser((prev) => (prev ? { ...prev, interests } : prev));
  }, []);

  const addAddress = useCallback(
    (address: Omit<Address, "id" | "isDefault">) => {
      setUser((prev) => {
        if (!prev) return prev;
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
          isDefault: prev.addresses.length === 0,
        };
        return { ...prev, addresses: [...prev.addresses, newAddress] };
      });
    },
    []
  );

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const remaining = prev.addresses.filter((a) => a.id !== id);
      const hasDefault = remaining.some((a) => a.isDefault);
      return {
        ...prev,
        addresses: remaining.map((a, index) => ({
          ...a,
          isDefault: hasDefault ? a.isDefault : index === 0,
        })),
      };
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            addresses: prev.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          }
        : prev
    );
  }, []);

  const isStudent = isHydrated && user !== null && isCollegeEmail(user.email);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isHydrated,
      isStudent,
      login,
      signup,
      logout,
      updateProfile,
      updateInterests,
      addAddress,
      removeAddress,
      setDefaultAddress,
    }),
    [
      user,
      isHydrated,
      isStudent,
      login,
      signup,
      logout,
      updateProfile,
      updateInterests,
      addAddress,
      removeAddress,
      setDefaultAddress,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}