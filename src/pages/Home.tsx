import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus2, ReceiptText, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { QuickAction } from '../components/QuickAction';
import { ShopInfoCard } from '../components/ShopInfoCard';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      {/* Global Navigation Header */}
      <SiteHeader />

      {/* Main Container - Optimized for Mobile & Centered for Desktop */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-5 sm:py-8 flex flex-col space-y-6 sm:space-y-8">
        {/* Top Hero Card with Golden Arched Aesthetic */}
        <section className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-b from-[#fbf8f0] via-[#f7f2e7] to-[#f4ede0] border-2 border-[#d4af37]/40 shadow-sm p-6 sm:p-9 text-center overflow-hidden">
          {/* Subtle Top Gold Vein Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-[#dfb743]/15 to-transparent blur-xl pointer-events-none" />

          {/* Top Filigree Accent */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent" />
            <span className="mx-2 text-[#c59b27] text-sm">❖</span>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent" />
          </div>

          {/* Brand Monogram Emblem */}
          <div className="flex flex-col items-center justify-center my-2 sm:my-3">
            {/* Diamond Crown */}
            <div className="text-[#c59b27] mb-1">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                <path d="M2 9h20M10 3l2 6 2-6M6 3l4 6-2 12M18 3l-4 6 2 12" />
              </svg>
            </div>

            {/* Stylized JAJ Text */}
            <div className="font-cinzel text-5xl sm:text-6xl font-black tracking-wider text-[#9a781b] leading-none select-none">
              JAJ
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight mt-3">
            <span className="text-[#06231a]">Jay Ambe </span>
            <span className="text-[#c59b27]">Jewellers</span>
          </h1>

          {/* Subtitle */}
          <p className="font-playfair text-sm sm:text-base tracking-[0.25em] uppercase text-[#06231a]/85 font-semibold mt-1">
            Digital Billing System
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center my-3.5 sm:my-4">
            <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#c59b27]/80 to-transparent" />
            <span className="mx-2 text-[#c59b27] text-xs">❖</span>
            <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#c59b27]/80 to-transparent" />
          </div>

          {/* Tagline */}
          <p className="font-playfair text-sm sm:text-base text-[#111827] font-medium tracking-wide">
            Simple. Secure. Professional Billing.
          </p>
        </section>

        {/* Primary Call to Action: Create New Bill */}
        <section>
          <Link
            to="/create-bill"
            className="group relative flex items-center justify-between w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#06231a] via-[#092e22] to-[#06231a] text-white border border-[#c59b27]/50 shadow-lg hover:shadow-xl hover:border-[#dfb743] transition-all duration-200 active:scale-[0.98]"
            style={{ minHeight: '64px' }}
          >
            <div className="flex items-center space-x-3.5 sm:space-x-4">
              {/* Document + Icon */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#03150f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                <FilePlus2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
              </div>

              {/* Text */}
              <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wide text-[#fefdfb] group-hover:text-[#d4af37] transition-colors">
                Create New Bill
              </span>
            </div>

            {/* Right Arrow Golden Circle */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c59b27] text-[#06231a] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
          </Link>
        </section>

        {/* Secondary Quick Action Cards */}
        <section className="space-y-3.5">
          {/* 2-Column Row: Recent Bills + Verify Bill */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <QuickAction
              to="/recent-bills"
              icon={ReceiptText}
              title="Recent Bills"
            />
            <QuickAction
              to="/verify"
              icon={ShieldCheck}
              title="Verify Bill"
            />
          </div>

          {/* Full Width Row: Shop / Contact */}
          <QuickAction
            to="/shop"
            icon={MapPin}
            title="Shop / Contact"
            className="w-full"
          />
        </section>

        {/* Shop Information Panel */}
        <section className="pt-2">
          <ShopInfoCard />
        </section>
      </main>

      {/* Subtle Copyright Footer */}
      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <div className="max-w-xl mx-auto px-4">
          <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
