export interface Address {
  id: string;
  label: string; // e.g. "Hostel", "Home"
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college?: string;
  addresses: Address[];
}