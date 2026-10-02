/**
 * Calculations for Jay Ambe Jewellers billing system
 */

export function calculateItemAmount(weight: number, rate: number): number {
  const w = Number(weight) || 0;
  const r = Number(rate) || 0;
  if (w <= 0 || r <= 0) return 0;
  // Weight in grams * Rate per gram
  return Math.round(w * r * 100) / 100;
}

export function calculateSubtotal(items: { amount: number }[]): number {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  return Math.round(sum * 100) / 100;
}

export function calculateDiscountAmount(
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  const sub = Number(subtotal) || 0;
  const val = Number(discountValue) || 0;
  if (val <= 0 || sub <= 0) return 0;

  if (discountType === 'percentage') {
    const clampedPercentage = Math.min(100, Math.max(0, val));
    const amount = (sub * clampedPercentage) / 100;
    return Math.round(amount * 100) / 100;
  } else {
    const fixedAmount = Math.max(0, val);
    return Math.round(fixedAmount * 100) / 100;
  }
}

export function calculateFinalTotal(subtotal: number, discount: number): number {
  const sub = Number(subtotal) || 0;
  const disc = Math.max(0, Number(discount) || 0);
  const total = Math.max(0, sub - disc);
  return Math.round(total * 100) / 100;
}

/**
 * Format numeric value as Indian Rupee (INR) format (e.g. ₹29,250 or 29,250.00)
 */
export function formatINR(val: number, withSymbol: boolean = true): string {
  const num = Number(val) || 0;
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
  });
  return withSymbol ? `₹ ${formatted}` : formatted;
}
