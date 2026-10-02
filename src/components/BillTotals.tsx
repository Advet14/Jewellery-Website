import React from 'react';
import { Calculator } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface BillTotalsProps {
  subtotal: number;
  discount: number;
  finalTotal: number;
  onDiscountChange: (discount: number) => void;
  error?: string;
}

export const BillTotals: React.FC<BillTotalsProps> = ({
  subtotal,
  discount,
  finalTotal,
  onDiscountChange,
  error,
}) => {
  return (
    <div className="bg-[#fdfcf9] rounded-2xl p-5 sm:p-7 border border-[#d4af37]/40 shadow-sm space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2d7c0]">
        <Calculator className="w-5 h-5 text-[#c59b27]" />
        <h2 className="font-playfair text-xl font-bold text-[#06231a]">
          Bill Summary
        </h2>
      </div>

      <div className="space-y-3 font-sans-ui text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-1 text-gray-700">
          <span className="font-medium">Subtotal</span>
          <span className="font-semibold text-[#06231a]">{formatINR(subtotal)}</span>
        </div>

        {/* Discount / Deduction */}
        <div className="flex items-center justify-between py-1 gap-3">
          <label htmlFor="discountInput" className="font-medium text-gray-700 shrink-0">
            Discount / Deduction
          </label>
          <div className="w-36 sm:w-44">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">₹</span>
              <input
                id="discountInput"
                type="number"
                min="0"
                step="1"
                value={discount === 0 ? '' : discount}
                onChange={(e) => {
                  const val = Math.max(0, parseFloat(e.target.value) || 0);
                  onDiscountChange(val);
                }}
                placeholder="0"
                className="w-full min-h-[44px] pl-7 pr-3 py-2 text-right font-semibold text-sm rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 bg-white"
              />
            </div>
            {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e2d7c0] pt-2" />

        {/* Final Total */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#06231a] to-[#0a3528] text-white shadow-md">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
              Final Total
            </span>
            <span className="text-[11px] text-[#ded8cb]">Net Payable Amount</span>
          </div>
          <span className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[#fefdfb]">
            {formatINR(finalTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
