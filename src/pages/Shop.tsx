import React from 'react';
import { Store, MapPin, Phone, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';

export const Shop: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      <SiteHeader />

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#06231a] hover:text-[#c59b27] transition-colors p-2 -ml-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Shop Main Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#06231a] to-[#0a2e23] text-[#fbf8f0] p-6 sm:p-8 border border-[#c59b27]/40 shadow-xl overflow-hidden space-y-6">
          {/* Top Filigree Accent */}
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="mx-2 text-[#d4af37] text-xs">❖</span>
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/60 bg-[#041a13] flex items-center justify-center mx-auto shadow-inner">
              <Store className="w-8 h-8 text-[#d4af37] stroke-[1.8]" />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
              Our Shop
            </span>

            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#fefdfb]">
              Jay Ambe Jewellers
            </h1>

            <p className="text-sm text-[#ded8cb] font-sans-ui">
              Gold - Silver Ornaments and Fancy Ornaments
            </p>
          </div>

          {/* Address Box */}
          <div className="p-4 rounded-2xl bg-[#041811] border border-[#c59b27]/30 space-y-2">
            <div className="flex items-start space-x-3 text-sm text-[#f5efe1]">
              <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p className="font-semibold text-white">Shop Address</p>
                <p className="text-[#ded8cb] text-xs sm:text-sm mt-0.5">
                  Near, Ahirsamajwadi | Main Chowk - Kidana
                </p>
                <p className="text-[#d8ceba] text-xs sm:text-sm">
                  Kidana - Gandhidham | Pin Code - 370 205
                </p>
              </div>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold block">
              Contact Numbers
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Urvish Soni */}
              <a
                href="tel:9265659480"
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#041811] border border-[#c59b27]/30 hover:border-[#d4af37] transition-colors group min-h-[48px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0d382b] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-[#b8ab94] block uppercase font-medium">
                    URVISH D SONI
                  </span>
                  <strong className="text-sm text-white group-hover:text-[#d4af37] font-mono">
                    92656 59480
                  </strong>
                </div>
              </a>

              {/* Raj Soni */}
              <a
                href="tel:9979625153"
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#041811] border border-[#c59b27]/30 hover:border-[#d4af37] transition-colors group min-h-[48px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0d382b] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-[#b8ab94] block uppercase font-medium">
                    RAJ D SONI
                  </span>
                  <strong className="text-sm text-white group-hover:text-[#d4af37] font-mono">
                    99796 25153
                  </strong>
                </div>
              </a>
            </div>
          </div>

          {/* Security & Official Billing Notice */}
          <div className="pt-2 border-t border-[#c59b27]/20 flex items-center space-x-2 text-xs text-[#ded8cb]">
            <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>Digital Billing System: Simple. Secure. Professional Billing.</span>
          </div>

          {/* Bottom Filigree Accent */}
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="mx-2 text-[#d4af37] text-xs">❖</span>
            <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
      </footer>
    </div>
  );
};
