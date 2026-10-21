'use client';

import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { navigationConfig, type NavigationConfig } from '@/config/navigation';

interface CategoryNavProps {
  config?: NavigationConfig;
  onSearchClick?: () => void;
}

export default function CategoryNav({
  config = navigationConfig,
  onSearchClick,
}: CategoryNavProps) {
  return (
    <nav
      aria-label="Category Navigation"
      className="hidden lg:block w-full bg-[#f4f3ed] border-b border-[#e6e6e6] text-[#1a1a1a] relative z-20"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[47px] flex items-center justify-between">
        {/* Navigation Categories */}
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-11">
          {config.categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#1a1a1a] hover:opacity-75 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <span>{category.label}</span>
              {category.hasDropdown && (
                <ChevronDown className="w-3.5 h-3.5 stroke-[2] text-[#1a1a1a]" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Search Icon (Desktop) */}
        <div className="flex items-center pl-4 flex-shrink-0">
          <button
            type="button"
            onClick={onSearchClick}
            className="p-1 text-[#1a1a1a] hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Search products"
          >
            <Search className="w-[19px] h-[19px] stroke-[1.8]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
