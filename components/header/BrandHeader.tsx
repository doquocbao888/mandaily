'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ChevronDown, Menu, X, Search } from 'lucide-react';
import { navigationConfig, type NavigationConfig } from '@/config/navigation';

interface BrandHeaderProps {
  config?: NavigationConfig;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  onSearchClick?: () => void;
}

export default function BrandHeader({
  config = navigationConfig,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
  onSearchClick,
}: BrandHeaderProps) {
  const [cartCount] = useState(config.utilityLinks.cart.count);

  return (
    <header className="w-full bg-[#1a1a1a] text-white select-none relative z-30">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-6 h-[44px] sm:h-[50px] lg:h-[55px] flex items-center justify-between">
        {/* Left Side: Mobile Menu Button (mobile only) & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onMobileMenuToggle && (
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1 text-white hover:text-neutral-300 transition-colors focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" />
              )}
            </button>
          )}

          <Link
            href={config.logo.href}
            className="flex items-center hover:opacity-95 transition-opacity"
            aria-label={config.logo.alt}
          >
            <div className="relative h-[18px] sm:h-[21px] lg:h-[23px] w-[105px] sm:w-[120px] lg:w-[131px] flex items-center">
              <Image
                src={config.logo.src}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
                priority
                className="h-[18px] sm:h-[21px] lg:h-[23px] w-auto object-contain brightness-100"
              />
            </div>
          </Link>
        </div>

        {/* Right Side: Utility Links, Locale, Account, Cart, and Mobile Search */}
        <div className="flex items-center gap-3.5 sm:gap-4 lg:gap-6 xl:gap-7">
          {/* Desktop Utility Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium tracking-normal text-white">
            <Link
              href={config.utilityLinks.rewards.href}
              className="hover:text-neutral-300 transition-colors whitespace-nowrap"
            >
              {config.utilityLinks.rewards.label}
            </Link>
            <Link
              href={config.utilityLinks.cause.href}
              className="hover:text-neutral-300 transition-colors whitespace-nowrap"
            >
              {config.utilityLinks.cause.label}
            </Link>
            <Link
              href={config.utilityLinks.sale.href}
              className="hover:text-neutral-300 transition-colors whitespace-nowrap"
            >
              {config.utilityLinks.sale.label}
            </Link>
          </nav>

          {/* Locale Selector (Desktop) */}
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1 text-[13px] font-medium text-white hover:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Select language"
          >
            <span>{config.utilityLinks.language.current}</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2] text-white" />
          </button>

          {/* User Account */}
          <Link
            href={config.utilityLinks.account.href}
            className="p-1 text-white hover:text-neutral-300 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Account"
          >
            <User className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] stroke-[1.8]" />
          </Link>

          {/* Cart Bag Icon with '0' inside */}
          <Link
            href={config.utilityLinks.cart.href}
            className="p-1 text-white hover:text-neutral-300 transition-colors relative flex items-center justify-center cursor-pointer"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <div className="relative inline-flex items-center justify-center">
              <svg
                width="18"
                height="20"
                viewBox="0 0 20 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="overflow-visible"
              >
                {/* Bag body */}
                <path d="M3.5 6.5h13l1.3 13.5H2.2L3.5 6.5z" />
                {/* Bag handle */}
                <path d="M7 6.5V4.2a3 3 0 0 1 6 0v2.3" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center pt-1.5 text-[9px] sm:text-[9.5px] font-bold tracking-tight text-white leading-none">
                {cartCount}
              </span>
            </div>
          </Link>

          {/* Mobile Search Button (visible on mobile/tablet, hidden on desktop where it resides in CategoryNav) */}
          <button
            type="button"
            onClick={onSearchClick}
            className="lg:hidden p-1 text-white hover:text-neutral-300 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.8]" />
          </button>
        </div>
      </div>
    </header>
  );
}
