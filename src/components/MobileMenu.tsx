import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X, FilePlus, ReceiptText, ShieldCheck, MapPin, Home } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  authenticated: boolean;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, authenticated, onLogout }) => {
  if (!isOpen) return null;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/create-bill', label: 'Create New Bill', icon: FilePlus },
    { to: '/recent-bills', label: 'Recent Bills', icon: ReceiptText },
    { to: '/verify', label: 'Verify Bill', icon: ShieldCheck },
    { to: '/shop', label: 'Shop / Contact', icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 w-4/5 max-w-xs bg-[#06231a] text-[#fbf8f0] flex flex-col justify-between p-6 shadow-2xl border-r border-[#c59b27]/30">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#c59b27]/20">
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-xl font-bold tracking-wider text-[#d4af37]">JAJ</span>
              <span className="text-sm font-playfair tracking-wide text-white">Jay Ambe Jewellers</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#d4af37] hover:bg-[#0d382b] transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-[#c59b27] text-[#06231a] font-semibold shadow-md'
                        : 'text-[#e5dfd3] hover:bg-[#0d382b] hover:text-[#d4af37]'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
            {authenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium text-[#e5dfd3] hover:bg-[#0d382b] hover:text-[#d4af37] transition-all"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign out</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer info in drawer */}
        <div className="pt-6 border-t border-[#c59b27]/20 text-xs text-[#d5cebf] space-y-1">
          <p className="font-semibold text-[#d4af37]">Jay Ambe Jewellers</p>
          <p>Main Chowk, Kidana - Gandhidham</p>
          <p className="text-[11px] text-[#a49a88] pt-2">Simple. Secure. Professional Billing.</p>
        </div>
      </div>
    </div>
  );
};
