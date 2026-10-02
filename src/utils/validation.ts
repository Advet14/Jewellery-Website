import type { BillItem } from '../types/bill';

export interface BillFormErrors {
  customerName?: string;
  mobile?: string;
  address?: string;
  billNumber?: string;
  billDate?: string;
  items?: string;
  discount?: string;
}

export function validateMobile(mobile: string): boolean {
  const cleaned = mobile.replace(/\s+/g, '').replace(/[-+]/g, '');
  // Matches 10 digit Indian mobile numbers
  return /^[6-9]\d{9}$/.test(cleaned.slice(-10));
}

export function validateBillForm(values: {
  customerName: string;
  mobile: string;
  address: string;
  billNumber: string;
  billDate: string;
  items: BillItem[];
  discount?: number;
  discountValue?: number;
  discountType?: 'percentage' | 'fixed';
}): { isValid: boolean; errors: BillFormErrors } {
  const errors: BillFormErrors = {};

  if (!values.customerName.trim()) {
    errors.customerName = 'Customer name is required';
  }

  if (!values.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(values.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!values.billNumber.trim()) {
    errors.billNumber = 'Bill number is required';
  }

  if (!values.billDate.trim()) {
    errors.billDate = 'Bill date is required';
  }

  if (!values.items || values.items.length === 0) {
    errors.items = 'Please add at least one jewellery item';
  } else {
    const invalidItem = values.items.find(
      (item) => !item.description.trim() || item.weight <= 0 || item.rate <= 0
    );
    if (invalidItem) {
      errors.items = 'All items must have a description, valid weight (>0) and rate (>0)';
    }
  }

  const discVal = values.discountValue !== undefined ? values.discountValue : (values.discount || 0);
  if (discVal < 0) {
    errors.discount = 'Discount cannot be negative';
  } else if (values.discountType === 'percentage' && discVal > 100) {
    errors.discount = 'Discount percentage cannot exceed 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
