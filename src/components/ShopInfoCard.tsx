import React from 'react';
import { Store, MapPin, Phone } from 'lucide-react';

export const ShopInfoCard: React.FC = () => {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#06231a] to-[#092a20] text-[#fbf8f0] p-5 sm:p-7 border border-[#c59b27]/40 shadow-xl overflow-hidden">
      {/* Top Ornate Filigree Accent */}
      <div className="flex items-center justify-center -mt-2 mb-3">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        <span className="mx-2 text-[#d4af37] text-xs">❖</span>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      <div className="flex items-start space-x-4 sm:space-x-5">
        {/* Storefront Circular Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#d4af37]/60 bg-[#041a13] flex items-center justify-center shrink-0 shadow-inner">
          <Store className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37] stroke-[1.8]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
            Our Shop
          </span>

          <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#fefdfb] mt-0.5 leading-snug">
            Jay Ambe Jewellers
          </h3>

          <p className="text-xs sm:text-sm text-[#ded8cb] font-sans-ui mt-1">
            Gold - Silver Ornaments and Fancy Ornaments
          </p>

          {/* Address */}
          <div className="mt-3.5 flex items-start space-x-2 text-xs sm:text-sm text-[#f5efe1]">
            <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p>Near, Ahirsamajwadi | Main Chowk - Kidana</p>
              <p className="text-[#d8ceba]">Kidana - Gandhidham | Pin Code - 370 205</p>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="mt-4 pt-3.5 border-t border-[#c59b27]/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            <a
              href="tel:9265659480"
              className="flex items-center space-x-2 text-[#ded8cb] hover:text-[#d4af37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>URVISH D SONI : <strong>92656 59480</strong></span>
            </a>
            <a
              href="tel:9979625153"
              className="flex items-center space-x-2 text-[#ded8cb] hover:text-[#d4af37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>RAJ D SONI : <strong>99796 25153</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Ornate Filigree Accent */}
      <div className="flex items-center justify-center mt-4 -mb-2">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        <span className="mx-2 text-[#d4af37] text-xs">❖</span>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>
    </div>
  );
};
