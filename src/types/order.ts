import type { Room, Pet } from './pet';

export type OrderStatus = 'pending' | 'confirmed' | 'checkin' | 'care' | 'checkout' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'deposit' | 'paid' | 'refunded';

export interface AddonService {
  id: string;
  name: string;
  type: 'grooming' | 'transport' | 'medical' | 'other';
  price: number;
  description: string;
}

export interface FeeDetail {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNo: string;
  roomId: string;
  room?: Room;
  petIds: string[];
  pets?: Pet[];
  checkinDate: string;
  checkoutDate: string;
  nights: number;
  addonServices: AddonService[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  depositAmount: number;
  totalAmount: number;
  paidAmount: number;
  feeDetails: FeeDetail[];
  specialNotes: string;
  checkinTime?: string;
  checkoutTime?: string;
  cageNumber?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}
