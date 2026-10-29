'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import QuickSearchModal from '@/components/search/QuickSearchModal';

const categories = [
  { label: 'Ưu Đãi & Combo', href: '/products?category=deals', hasDropdown: true },
  { label: 'Chăm Sóc Vùng Kín', href: '/products?category=groin', hasDropdown: true },
  { label: 'Râu & Mặt', href: '/products?category=beard', hasDropdown: true },
  { label: 'Tóc & Toàn Thân', href: '/products?category=body', hasDropdown: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      {/* Top utility / announcement bar */}
      <div className="bg-black text-white text-[11px] sm:text-[12px] h-[36px] flex items-center justify-between px-3 sm:px-8">
        {/* Mobile: compact promo message */}
        <div className="block sm:hidden w-full text-center truncate tracking-wide text-neutral-200">
          <span>Miễn phí giao hàng cho đơn từ 499.000đ | </span>
          <Link href="/products" className="underline font-medium text-[#c59b63]">Mua sắm ngay</Link>
        </div>

        {/* Desktop: Full utility links */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="tel:19008888" className="hover:underline transition-all">Hỗ trợ: 1900 8888</Link>
          <Link href="/tracking" className="hover:underline text-[#c59b63] font-semibold transition-all">Tra cứu đơn hàng</Link>
          <Link href="/products" className="hover:underline transition-all">Tất cả sản phẩm</Link>
        </div>
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/products?category=deals" className="hover:underline font-semibold text-[#c59b63]">Khuyến mãi (Lên tới 30%)</Link>
          <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity">
            <Globe className="w-3.5 h-3.5" />
            <span>Việt Nam (VN)</span>
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
            MANFRESH
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2 sm:space-x-5 text-neutral-900">
          <button 
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer" 
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>
          <button 
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors relative cursor-pointer" 
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </button>
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
                <span className="text-[18px] font-black tracking-[0.1em] uppercase">MANFRESH</span>
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
                  Danh mục sản phẩm
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

                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-[15px] font-semibold text-[#c59b63] hover:bg-amber-50/50 transition-colors"
                >
                  <span>Xem tất cả bộ sưu tập</span>
                  <ChevronRight className="w-4 h-4 text-[#c59b63] stroke-[2]" />
                </Link>

                <div className="pt-6 pb-2 px-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Dịch vụ & Tra cứu
                </div>
                {[
                  { label: 'Tra cứu đơn hàng (Live Tracking)', href: '/tracking' },
                  { label: 'Hotline CSKH: 1900 8888', href: 'tel:19008888' },
                  { label: 'Ưu đãi & Khuyến mãi', href: '/products?category=deals' },
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
                <span className="text-[13px] font-medium text-neutral-500">
                  © MANFRESH Vietnam
                </span>
                <div className="flex items-center gap-1 text-[13px] font-medium text-neutral-600">
                  <Globe className="w-4 h-4" />
                  <span>VN</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
