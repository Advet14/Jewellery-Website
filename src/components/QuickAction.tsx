import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface QuickActionProps {
  to: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  to,
  icon: Icon,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <Link
      to={to}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#fdfbf7] border border-[#d4af37]/40 shadow-sm hover:shadow-md hover:border-[#c59b27] transition-all duration-200 active:scale-[0.98] ${className}`}
    >
      <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-[#06231a] group-hover:text-[#c59b27] transition-colors shrink-0">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0">
          <span className="font-playfair text-base sm:text-lg font-bold text-[#06231a] group-hover:text-[#0b382a] leading-tight truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-[#6e7d77] truncate font-sans-ui mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Circular Arrow Badge */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#faeed2] text-[#06231a] flex items-center justify-center shrink-0 ml-2 group-hover:bg-[#dfb743] group-hover:text-[#06231a] transition-all">
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </div>
    </Link>
  );
};
