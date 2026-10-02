import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Search, QrCode, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { billService } from '../services/billService';
import type { BillVerification } from '../services/billService';

export const VerifyBill: React.FC = () => {
  const { verificationId } = useParams();
  const [verificationInput, setVerificationInput] = useState(verificationId ?? '');
  const [result, setResult] = useState<{
    searched: boolean;
    status: 'VALID' | 'NOT_FOUND' | 'CANCELLED' | 'REPORTED_STOLEN';
    bill?: BillVerification;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;

    setIsVerifying(true);
    setError('');
    const cleaned = verificationInput.trim();

    try {
      const found = await billService.verifyBill(cleaned);
      if (!found) {
        setResult({ searched: true, status: 'NOT_FOUND' });
      } else {
        setResult({
          searched: true,
          status: found.status === 'ACTIVE' ? 'VALID' : found.status,
          bill: found,
        });
      }
    } catch (verifyError) {
      console.error('Bill verification failed:', verifyError);
      setError(verifyError instanceof Error ? verifyError.message : 'Could not verify this bill. Please try again.');
      setResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      <SiteHeader />

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#faeed2] text-[#9a781b] flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
            Official Verification
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#06231a]">
            Verify Bill Authenticity
          </h1>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
              Enter the unique Verification ID printed on the official Jay Ambe Jewellers invoice to verify its authenticity.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#d4af37]/40 shadow-sm space-y-4">
          <div>
            <label
              htmlFor="verificationId"
              className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5"
            >
              Verification ID
            </label>
            <div className="relative">
              <input
                id="verificationId"
                type="text"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                placeholder="e.g. JAJ-VFY-8F72KQ91M4"
                className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-[#d8ccb6] focus:border-[#c59b27] focus:ring-2 focus:ring-[#c59b27]/20 text-sm font-mono tracking-wide"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying || !verificationInput.trim()}
            className="w-full min-h-[46px] py-3 px-5 rounded-xl bg-gradient-to-r from-[#06231a] to-[#0a3528] text-white font-semibold text-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>{isVerifying ? 'Verifying...' : 'Verify Now'}</span>
          </button>
        </form>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Future QR Scanner Camera Zone (Prepared Area) */}
        <div className="p-4 rounded-2xl border border-dashed border-[#c59b27]/50 bg-[#fdfbf7] flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            <QrCode className="w-6 h-6 text-[#9a781b] shrink-0" />
            <div>
              <p className="font-semibold text-[#06231a]">Scan Invoice QR Code</p>
              <p className="text-[11px] text-gray-500">Camera scan ready for hardware scanners</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#9a781b] bg-[#faeed2] px-2.5 py-1 rounded-md">
            Prepared
          </span>
        </div>

        {/* Verification Result Area */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {result.status === 'VALID' && result.bill && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-500/80 shadow-lg space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Authentic & Verified
                    </span>
                    <h3 className="font-playfair text-xl font-bold text-[#06231a] mt-0.5">
                      Genuine Jay Ambe Jewellers Bill
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-2 border-t border-gray-100 font-sans-ui">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Bill Number</span>
                    <strong className="text-[#06231a] font-bold">#{result.bill.billNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Bill Date</span>
                    <strong className="text-[#06231a]">{result.bill.billDate}</strong>
                  </div>
                </div>
              </div>
            )}

            {result.status === 'NOT_FOUND' && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-300 shadow-sm space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-gray-900">
                  Bill Record Not Found
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  No matching bill was found with ID &ldquo;{verificationInput}&rdquo;. Please verify the number from your physical bill receipt.
                </p>
              </div>
            )}

            {result.status === 'CANCELLED' && result.bill && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-amber-500 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Status: Cancelled
                    </span>
                    <h3 className="font-playfair text-lg font-bold text-[#06231a] mt-0.5">
                      This Bill Was Cancelled
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Bill #{result.bill.billNumber} on {result.bill.billDate} was marked as cancelled.
                </p>
              </div>
            )}

            {result.status === 'REPORTED_STOLEN' && result.bill && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-red-500 shadow-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      Warning: Reported Stolen
                    </span>
                    <h3 className="font-playfair text-lg font-bold text-red-900 mt-0.5">
                      Security Alert
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-red-700 font-medium">
                  Bill #{result.bill.billNumber} dated {result.bill.billDate} has been flagged as reported stolen. Please contact Jay Ambe Jewellers or local authorities immediately.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
      </footer>
    </div>
  );
};
