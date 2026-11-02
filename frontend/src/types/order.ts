export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number; // price paid per unit
  quantity: number;
}

export interface Order {
  id: string;
  date: string; // ISO date string
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}