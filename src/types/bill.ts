export type BillStatus = 'ACTIVE' | 'CANCELLED' | 'REPORTED_STOLEN';

export interface BillItem {
  id: string;
  description: string;
  weight: number; // in grams
  rate: number; // per gram in INR
  amount: number; // weight * rate
}

export interface Bill {
  id: string;
  billNumber: string;
  verificationId: string;
  customerName: string;
  mobile: string;
  address: string;
  billDate: string; // YYYY-MM-DD
  jewelleryPhoto?: string; // base64 data URL or asset URL
  items: BillItem[];
  subtotal: number;
  discount: number; // discount amount in INR
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  finalTotal: number;
  status: BillStatus;
  createdAt: string;
  updatedAt?: string;
}
