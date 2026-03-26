export type Role = 'admin' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  password?: string;
}

export interface ReferralCode {
  id: string;
  code: string;
  salesId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PickupPoint {
  id: string;
  name: string;
}

export type OrderStatus = 
  | 'New'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'Paid'
  | 'Ready for Pickup'
  | 'Picked Up'
  | 'Contacted'
  | 'Follow Up'
  | 'Closed Won'
  | 'Closed Lost';

export interface OrderHistory {
  date: string;
  status: OrderStatus;
  note: string;
  changedBy: string;
}

export interface LeadOrder {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  university: string;
  facultyMajor?: string;
  city: string;
  productId: string;
  quantity: number;
  pickupPointId: string;
  notes?: string;
  referralCode: string;
  assignedSalesId?: string;
  status: OrderStatus;
  history: OrderHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}
