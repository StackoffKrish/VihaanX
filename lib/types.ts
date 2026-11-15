
export type PaymentMethod = 'UPI' | 'Pay Later';
export type OrderStatus = 'Order received' | 'Accepted by kirana' | 'Preparing order' | 'Ready for delivery' | 'Out for delivery' | 'Delivered';

export interface Product {
  id: string;
  name: string;
  category: string;
  pack: string;
  pricePaise: number;
  mrpPaise?: number;
  stock: number;
  image: string;
  tag?: string;
  popular?: boolean;
}
export interface CartItem { productId: string; qty: number; }
export interface OrderItem { productId: string; name: string; pack: string; pricePaise: number; qty: number; image: string; }
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  items: OrderItem[];
  subtotalPaise: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  address: string;
  phone: string;
}
export interface Settlement {
  id: string;
  orderId: string;
  shopId: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  grossPaise: number;
  feePaise: number;
  netPaise: number;
  status: 'Settled' | 'Pending';
  settledAt: string;
}
export interface Repayment {
  id: string;
  customerId: string;
  amountPaise: number;
  date: string;
  status: 'Completed';
  method: string;
}
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  house: string;
  depositPaise: number;
  depositPaid: boolean;
  payLaterLimitPaise: number;
  availableCreditPaise: number;
  outstandingPaise: number;
  trustScore: number;
  joinedAt: string;
}
export interface AppState {
  customer: Customer | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  settlements: Settlement[];
  repayments: Repayment[];
  shop: { id: string; name: string; colony: string; status: string; owner: string };
  lastOrderId: number;
}
export const FEE_BPS = 150; // 1.5%
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: rupees % 1 === 0 ? 0 : 2 }).format(rupees);
}
export function formatINR2(paise: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paise/100);
}
