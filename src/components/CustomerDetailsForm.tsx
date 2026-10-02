import React from 'react';
import { User, Phone, MapPin, Hash } from 'lucide-react';
import type { BillFormErrors } from '../utils/validation';

interface CustomerDetailsFormProps {
  customerName: string;
  mobile: string;
  address: string;
  billNumber: string;
  billDate: string;
  errors: BillFormErrors;
  onChange: (field: string, value: string) => void;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customerName,
  mobile,
  address,
  billNumber,
  billDate,
  errors,
  onChange,
}) => {
  return (
    <div className="bg-[#fdfcf9] rounded-2xl p-5 sm:p-7 border border-[#d4af37]/40 shadow-sm space-y-5">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2d7c0]">
        <User className="w-5 h-5 text-[#c59b27]" />
        <h2 className="font-playfair text-xl font-bold text-[#06231a]">
          Customer Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Customer Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="customerName"
            className="block text-xs uppercase tracking-wider font-semibold text-[#374151] mb-1.5"
          >
            Customer Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => onChange('customerName', e.target.value)}
              placeholder="e.g. Pravinbhai K. Patel"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.customerName
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#d8ccb6] focus:border-[#c59b27] focus:ring-[#c59b27]/20'
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.customerName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="mobile"
            className="block text-xs uppercase tracking-wider font-semibold text-[#374151] mb-1.5"
          >
            Mobile Number <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => onChange('mobile', e.target.value)}
              placeholder="e.g. 98250 12345"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.mobile
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#d8ccb6] focus:border-[#c59b27] focus:ring-[#c59b27]/20'
              }`}
            />
            <Phone className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.mobile && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.mobile}</p>
          )}
        </div>

        {/* Bill Number */}
        <div>
          <label
            htmlFor="billNumber"
            className="block text-xs uppercase tracking-wider font-semibold text-[#374151] mb-1.5"
          >
            Bill Number <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="billNumber"
              type="text"
              value={billNumber}
              onChange={(e) => onChange('billNumber', e.target.value)}
              placeholder="e.g. 1005"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.billNumber
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#d8ccb6] focus:border-[#c59b27] focus:ring-[#c59b27]/20'
              }`}
            />
            <Hash className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.billNumber && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.billNumber}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-xs uppercase tracking-wider font-semibold text-[#374151] mb-1.5"
          >
            Address <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Near Ram Mandir, Kidana"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#d8ccb6] focus:border-[#c59b27] focus:ring-[#c59b27]/20'
              }`}
            />
            <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.address && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.address}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="billDate"
            className="block text-xs uppercase tracking-wider font-semibold text-[#374151] mb-1.5"
          >
            Date <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="billDate"
              type="date"
              value={billDate}
              onChange={(e) => onChange('billDate', e.target.value)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#111827] focus:outline-none focus:ring-2 transition-all ${
                errors.billDate
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-[#d8ccb6] focus:border-[#c59b27] focus:ring-[#c59b27]/20'
              }`}
            />
          </div>
          {errors.billDate && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.billDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};
