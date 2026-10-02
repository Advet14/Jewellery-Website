import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ReceiptText, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import type { Bill, BillStatus } from '../types/bill';
import { billService } from '../services/billService';
import { formatINR } from '../utils/calculations';

export const RecentBills: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    billService.getBills()
      .then((data) => {
        if (active) setBills(data);
      })
      .catch((loadError: unknown) => {
        console.error('Could not load recent bills:', loadError);
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load recent bills.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.billNumber.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.mobile.includes(q) ||
      b.verificationId.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: BillStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'REPORTED_STOLEN':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Reported Stolen</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      <SiteHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5dfd3] pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
              Billing History
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#06231a] mt-0.5">
              Recent Bills
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/create-bill')}
            className="min-h-[44px] inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#06231a] text-white text-xs sm:text-sm font-semibold hover:bg-[#0b3e2f] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>Create New Bill</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Bill No, Customer Name, or Mobile..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 bg-white text-sm"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Bills Display */}
        {loading ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <div className="w-8 h-8 border-3 border-[#c59b27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Loading bills...</p>
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#e5ded0] space-y-3">
            <ReceiptText className="w-12 h-12 text-gray-300 mx-auto stroke-[1.5]" />
            <h3 className="font-playfair text-lg font-bold text-[#06231a]">No recent bills found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No bills match your current search query.'
                : 'There are no bills recorded in the system yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                onClick={() => navigate(`/preview?id=${bill.id}`, { state: { bill } })}
                className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#d4af37]/35 hover:border-[#c59b27] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 active:scale-[0.99]"
              >
                {/* Left Info */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#fbf6e8] border border-[#d4af37]/40 flex items-center justify-center text-[#9a781b] font-bold text-sm shrink-0">
                    #{bill.billNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="font-playfair text-base sm:text-lg font-bold text-[#06231a] group-hover:text-[#0a3528] truncate">
                        {bill.customerName}
                      </h3>
                      {getStatusBadge(bill.status)}
                    </div>

                    <p className="text-xs text-[#6e7d77] mt-0.5 truncate">
                      {bill.mobile} • {bill.billDate}
                    </p>

                    <p className="text-[11px] text-[#9a781b] font-mono mt-0.5">
                      {bill.verificationId}
                    </p>
                  </div>
                </div>

                {/* Right Info: Total & View action */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f2ede4]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-semibold text-gray-500 block">
                      Total Amount
                    </span>
                    <span className="font-playfair text-lg sm:text-xl font-bold text-[#06231a]">
                      {formatINR(bill.finalTotal)}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#faeed2] text-[#06231a] flex items-center justify-center shrink-0 group-hover:bg-[#c59b27] group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
      </footer>
    </div>
  );
};
