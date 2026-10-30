'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeProducts } from '@/lib/dbService';
import { featuredProductsConfig2, type ProductItem } from '@/config/products';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}



const SUGGESTED_KEYWORDS = [
  'Gen 6',
  'Combo ưu đãi',
  'Tông đơ râu & mặt',
  'Dao cạo SkinSafe',
  'Sữa tắm khử mùi',
];

export default function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      setProducts(data || []);
    });
    return () => unsubscribe();
  }, []);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const normalized = searchTerm.trim().toLowerCase();
  const searchResults = normalized
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.subtitle.toLowerCase().includes(normalized) ||
          (p.badge && p.badge.toLowerCase().includes(normalized)) ||
          (p.categoryPath && p.categoryPath.some((cat) => cat.toLowerCase().includes(normalized)))
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-start">
          {/* Backdrop below dropdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-[2px] z-10 cursor-pointer"
          />

          {/* Top Dropdown Drawer (Exact Manscaped Style from image_521decfc.png) */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#F4F3ED] border-b border-[#e5e2d8] shadow-2xl relative z-20 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button (Aligned top right as in reference screenshot) */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-200/50 cursor-pointer"
                aria-label="Đóng tìm kiếm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1140px] mx-auto px-4 sm:px-8 pb-10 sm:pb-14">
              {/* Search Input Bar (Warm Gold Outline with Magnifying Glass) */}
              <div className="relative w-full border-[1.5px] border-[#a0742f] bg-[#F4F3ED] flex items-center px-4 h-[48px] sm:h-[52px] shadow-xs">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Thử tìm “Bộ dao cạo”, “Lawn Mower”..."
                  className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 text-sm sm:text-[15px] font-normal px-3 outline-none"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200/70 transition"
                    aria-label="Xóa nội dung"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View 1: Default Trending View (Exact match to screenshot image_521decfc.png) */}
              {!normalized && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-xs sm:text-[13px] font-semibold text-neutral-800 tracking-wide mb-4">
                    Xu hướng tìm kiếm
                  </h3>

                  {/* Active Products Grid */}
                  {products.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                      {products.slice(0, 4).map((prod) => (
                        <Link
                          key={prod.id}
                          href={prod.href || `/products/${prod.id}`}
                          onClick={handleClose}
                          className="group flex flex-col cursor-pointer"
                        >
                          {/* Square Card Box */}
                          <div className="relative aspect-square w-full bg-[#eae9e4] flex items-center justify-center overflow-hidden rounded-[1px] transition-transform duration-300 group-hover:scale-[1.02]">
                            <Image
                              src={prod.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png'}
                              alt={prod.title}
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
                              className="object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Title, Subtitle & Price */}
                          <div className="mt-3 space-y-0.5">
                            <h4 className="font-bold text-[14px] sm:text-[15px] text-neutral-900 leading-snug line-clamp-1 group-hover:text-[#9e6f1c] transition-colors">
                              {prod.title}
                            </h4>
                            <p className="text-[12px] sm:text-[13px] text-neutral-500 line-clamp-1 font-normal">
                              {prod.subtitle}
                            </p>
                            <div className="pt-0.5">
                              <span className="font-bold text-[13.5px] sm:text-[14px] text-neutral-900">
                                {prod.vipPrice || prod.regularPrice}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Quick Suggestions Chips */}
                  <div className="mt-6 pt-5 border-t border-[#e5e2d8] flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-neutral-600 uppercase tracking-wider mr-1">
                      Gợi ý tìm kiếm:
                    </span>
                    {SUGGESTED_KEYWORDS.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => setSearchTerm(keyword)}
                        className="px-3 py-1 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-300 transition-colors cursor-pointer"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View 2: Live Search Results Grid */}
              {normalized && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center justify-between text-xs sm:text-[13px] font-semibold text-neutral-800 tracking-wide mb-4">
                    <span>Kết quả tìm kiếm cho &ldquo;{searchTerm}&rdquo;</span>
                    <span className="text-neutral-500 font-normal">{searchResults.length} sản phẩm</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-12 text-neutral-600 space-y-2">
                      <p className="text-sm font-semibold text-neutral-800">
                        Không tìm thấy sản phẩm nào phù hợp với &ldquo;{searchTerm}&rdquo;.
                      </p>
                      <p className="text-xs text-neutral-500">
                        Thử tìm các từ khóa phổ biến như &ldquo;Lawn Mower&rdquo;, &ldquo;Beard&rdquo;, &ldquo;Kit&rdquo; hoặc xem tất cả danh mục.
                      </p>
                      <div className="pt-3">
                        <Link
                          href="/products"
                          onClick={handleClose}
                          className="inline-block text-xs font-bold uppercase tracking-wider text-[#9e6f1c] hover:underline"
                        >
                          Khám phá tất cả sản phẩm →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/products/${prod.id}`}
                          onClick={handleClose}
                          className="group flex flex-col cursor-pointer"
                        >
                          <div className="relative aspect-square w-full bg-[#eae9e4] flex items-center justify-center overflow-hidden rounded-[1px] transition-transform duration-300 group-hover:scale-[1.02]">
                            <Image
                              src={prod.imageSrc}
                              alt={prod.title}
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
                              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="mt-3 space-y-0.5">
                            <h4 className="font-bold text-[14px] sm:text-[15px] text-neutral-900 leading-snug line-clamp-1 group-hover:text-[#9e6f1c] transition-colors">
                              {prod.title.replace(' - NEW!', '')}
                            </h4>
                            <p className="text-[12px] sm:text-[13px] text-neutral-500 line-clamp-1 font-normal">
                              {prod.subtitle}
                            </p>
                            <div className="pt-0.5">
                              <span className="font-bold text-[13.5px] sm:text-[14px] text-neutral-900">
                                {prod.regularPrice || prod.vipPrice}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
