import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#06231a] text-[#fbf8f0] shadow-md border-b border-[#c59b27]/30 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Left Brand & Menu Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Hamburger for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-[#d4af37] hover:text-white hover:bg-[#0a3528] md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
            </button>

            {/* Logo & Shop Title */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              {/* Monogram Badge */}
              <div className="flex items-center justify-center font-cinzel font-bold text-lg sm:text-2xl text-[#d4af37] tracking-wider transition-transform group-hover:scale-105">
                <span className="relative flex items-center">
                  <span className="text-[#e6c35c]">JAJ</span>
                </span>
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <span className="font-playfair text-lg sm:text-2xl font-bold tracking-wide text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors leading-tight">
                  Jay Ambe Jewellers
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider text-[#d4af37] uppercase font-sans-ui hidden xs:block">
                  Digital Billing System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#d4af37] bg-[#0a3528]'
                    : 'text-[#e6e0d2] hover:text-[#d4af37] hover:bg-[#082e22]'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/recent-bills"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#d4af37] bg-[#0a3528]'
                    : 'text-[#e6e0d2] hover:text-[#d4af37] hover:bg-[#082e22]'
                }`
              }
            >
              Recent Bills
            </NavLink>
            <NavLink
              to="/verify"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#d4af37] bg-[#0a3528]'
                    : 'text-[#e6e0d2] hover:text-[#d4af37] hover:bg-[#082e22]'
                }`
              }
            >
              Verify Bill
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#d4af37] bg-[#0a3528]'
                    : 'text-[#e6e0d2] hover:text-[#d4af37] hover:bg-[#082e22]'
                }`
              }
            >
              Shop / Contact
            </NavLink>

            {/* Desktop CTA */}
            <Link
              to="/create-bill"
              className="ml-3 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#dfb743] text-[#06231a] font-semibold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Bill</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
