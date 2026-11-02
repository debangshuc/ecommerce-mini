import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

const pincode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code");

const fullName = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(60, "Name is too long");

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

export const signupSchema = z
  .object({
    fullName,
    email,
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const checkoutSchema = z.object({
  fullName,
  email,
  phone,
  address: z.string().trim().min(10, "Enter your complete delivery address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().min(1, "Select your state"),
  pincode,
  payment: z.enum(["upi", "card", "netbanking", "cod"]),
});

export const addressSchema = z.object({
  label: z.string().trim().min(2, "Give this address a name, e.g. Hostel"),
  fullName,
  phone,
  line1: z.string().trim().min(10, "Enter your complete address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().min(1, "Select your state"),
  pincode,
});

export const profileSchema = z.object({
  fullName,
  phone,
  college: z.string().trim().max(80, "College name is too long"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type AddressValues = z.infer<typeof addressSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;