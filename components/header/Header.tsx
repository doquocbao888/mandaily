'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { label: 'Deals & Kits', href: '#', hasDropdown: true },
  { label: 'Groin', href: '#', hasDropdown: true },
  { label: 'Beard & Face', href: '#', hasDropdown: true },
  { label: 'Head & Body', href: '#', hasDropdown: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      {/* Top utility / announcement bar */}
      <div className="bg-black text-white text-[11px] sm:text-[12px] h-[36px] flex items-center justify-between px-3 sm:px-8">
        {/* Mobile: compact promo message */}
        <div className="block sm:hidden w-full text-center truncate tracking-wide text-neutral-200">
          <span>Free Shipping on Orders Over $50 | </span>
          <Link href="#" className="underline font-medium text-white">Shop Sale</Link>
        </div>

        {/* Desktop: Full utility links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="#" className="hover:underline transition-all">Support</Link>
          <Link href="#" className="hover:underline transition-all">Track Order</Link>
          <Link href="#" className="hover:underline transition-all">Subscriptions</Link>
        </div>
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="#" className="hover:underline transition-all">Unlock Rewards</Link>
          <Link href="#" className="hover:underline transition-all">Our Cause</Link>
          <Link href="#" className="hover:underline font-semibold text-white">Sale</Link>
          <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-neutral-200 h-[58px] sm:h-[68px] flex items-center justify-between px-3 sm:px-8 relative">
        {/* Left: Mobile Menu Toggle + Desktop Nav Categories */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-1 text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>
          
          <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-medium text-neutral-900 tracking-wide">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="hover:text-neutral-600 transition-colors whitespace-nowrap">
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-[19px] sm:text-[22px] font-black tracking-[0.1em] uppercase text-black hover:opacity-95 transition-opacity">
            MANSCAPED
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2 sm:space-x-5 text-neutral-900">
          <button 
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer" 
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>
          <button 
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer" 
            aria-label="Account"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>
          <Link 
            href="#" 
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors relative cursor-pointer" 
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white z-50 flex flex-col shadow-2xl lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 h-[64px] border-b border-neutral-200 bg-neutral-900 text-white">
                <span className="text-[18px] font-black tracking-[0.1em] uppercase">MANSCAPED</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-white hover:text-neutral-300 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 stroke-[2]" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 py-4 px-2 space-y-1">
                <div className="px-3 pb-2 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Shop Categories
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-lg text-[15px] font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
                  </Link>
                ))}

                <div className="pt-6 pb-2 px-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Customer Care & Info
                </div>
                {[
                  { label: 'Support', href: '#' },
                  { label: 'Track Order', href: '#' },
                  { label: 'Subscriptions', href: '#' },
                  { label: 'Unlock Rewards', href: '#' },
                  { label: 'Our Cause', href: '#' },
                  { label: 'Sale (Up to 30% Off)', href: '#' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <Link
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-[14px] font-semibold text-neutral-900"
                >
                  <User className="w-4 h-4 stroke-[2]" />
                  <span>Account Login</span>
                </Link>
                <div className="flex items-center gap-1 text-[13px] font-medium text-neutral-600">
                  <Globe className="w-4 h-4" />
                  <span>EN</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
