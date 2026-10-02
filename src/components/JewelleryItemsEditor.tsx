import React from 'react';
import { Plus, Trash2, Gem } from 'lucide-react';
import type { BillItem } from '../types/bill';
import { calculateItemAmount, formatINR } from '../utils/calculations';

interface JewelleryItemsEditorProps {
  items: BillItem[];
  onChange: (items: BillItem[]) => void;
  error?: string;
}

export const JewelleryItemsEditor: React.FC<JewelleryItemsEditorProps> = ({
  items,
  onChange,
  error,
}) => {
  const handleItemChange = (index: number, field: keyof BillItem, rawValue: string | number) => {
    const updated = [...items];
    const current = { ...updated[index] };

    if (field === 'description') {
      current.description = String(rawValue);
    } else if (field === 'weight') {
      const val = parseFloat(String(rawValue)) || 0;
      current.weight = val;
      current.amount = calculateItemAmount(current.weight, current.rate);
    } else if (field === 'rate') {
      const val = parseFloat(String(rawValue)) || 0;
      current.rate = val;
      current.amount = calculateItemAmount(current.weight, current.rate);
    }

    updated[index] = current;
    onChange(updated);
  };

  const addItem = () => {
    const newItem: BillItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      description: '',
      weight: 0,
      rate: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      // Keep at least one empty item instead of 0 items
      onChange([
        {
          id: 'empty-item',
          description: '',
          weight: 0,
          rate: 0,
          amount: 0,
        },
      ]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="bg-[#fdfcf9] rounded-2xl p-5 sm:p-7 border border-[#d4af37]/40 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2d7c0]">
        <div className="flex items-center space-x-2.5">
          <Gem className="w-5 h-5 text-[#c59b27]" />
          <h2 className="font-playfair text-xl font-bold text-[#06231a]">
            Jewellery Items
          </h2>
        </div>
        <span className="text-xs text-[#707e77] font-medium font-sans-ui">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-4 rounded-xl bg-white border border-[#e5dfd3] shadow-sm relative space-y-3"
          >
            {/* Row Header with Item Number & Delete */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9a781b] bg-[#fbf6e8] px-2.5 py-0.5 rounded-md">
                Item #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="min-h-[36px] min-w-[36px] p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                aria-label={`Remove Item ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Item Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Description */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="e.g. 22K Gold Ring"
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 text-sm bg-white"
                />
              </div>

              {/* Weight */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.weight === 0 ? '' : item.weight}
                  onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                  placeholder="0.00"
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 text-sm bg-white"
                />
              </div>

              {/* Rate */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Rate (₹/g)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={item.rate === 0 ? '' : item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  placeholder="e.g. 6850"
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 text-sm bg-white"
                />
              </div>

              {/* Calculated Amount */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Amount (₹)
                </label>
                <div className="min-h-[44px] px-3 py-2 rounded-xl bg-[#f9f7f2] border border-[#e5ded0] flex items-center justify-end font-bold text-[#06231a] text-sm font-sans-ui">
                  {formatINR(item.amount)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border-2 border-dashed border-[#c59b27]/70 hover:border-[#c59b27] bg-[#fbf8ee] hover:bg-[#faeed2] text-[#06231a] font-semibold text-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 stroke-[2.5] text-[#9a781b]" />
        <span>Add Another Item</span>
      </button>
    </div>
  );
};
