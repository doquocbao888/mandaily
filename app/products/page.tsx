'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/header/Header';
import SuperBanner from '@/components/header/SuperBanner';
import Footer from '@/components/header/Footer';
import { subscribeProducts } from '@/lib/dbService';
import { formatVND, parseVND } from '@/lib/formatters';
import { featuredProductsConfig2, type ProductItem } from '@/config/products';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'deals', label: 'Ưu Đãi & Combo' },
  { id: 'groin', label: 'Chăm Sóc Vùng Kín' },
  { id: 'beard', label: 'Râu & Mặt' },
  { id: 'body', label: 'Tóc & Toàn Thân' },
];

const CATEGORY_META: Record<
  string,
  { kicker: string; title: string; desc: string; bannerImg: string }
> = {
  deals: {
    kicker: 'BỘ SƯU TẬP & COMBO ĐẶC BIỆT.',
    title: 'Khuyến mãi & Combo',
    desc: 'Tạm biệt những khoảnh khắc chăm sóc bất tiện. Bộ sản phẩm grooming của chúng tôi có đầy đủ dụng cụ giúp bạn luôn lịch lãm, sảng khoái và tự tin.',
    bannerImg: '/assets/aistudio/manscaped_deals_banner_right.jpg',
  },
  groin: {
    kicker: 'CÔNG NGHỆ SKINSAFE™ CHÍNH XÁC.',
    title: 'Chăm sóc vùng nhạy cảm',
    desc: 'Được thiết kế chuyên biệt cho vùng dưới. Lưỡi dao gốm SkinSafe™ tiên tiến, động cơ 7.000 vòng/phút êm ái và chống nước IPX7.',
    bannerImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
  },
  beard: {
    kicker: 'CẠO & TẠO KIỂU CHUYÊN NGHIỆP.',
    title: 'Râu & Khuôn mặt',
    desc: 'Từ râu quai nón đến phong cách lịch lãm. Cắt, tỉa và tạo kiểu với độ chính xác tuyệt đối.',
    bannerImg: '/assets/aistudio/the-beard-balls-and-strays-bundle_product_desktop_255fa9af.jpg',
  },
  body: {
    kicker: 'VỆ SINH TOÀN DIỆN TỪ ĐẦU ĐẾN CHÂN.',
    title: 'Toàn thân',
    desc: 'Làm sạch toàn thân hoàn hảo với các dòng dung dịch vệ sinh và tông đơ chính xác giúp bạn luôn thơm tho suốt cả ngày.',
    bannerImg: '/assets/aistudio/homepage-superbowl_category-head-and-body_25ee9350.jpg',
  },
  all: {
    kicker: 'BỘ SƯU TẬP & COMBO ĐẶC BIỆT.',
    title: 'Khuyến mãi & Combo',
    desc: 'Tạm biệt những khoảnh khắc chăm sóc bất tiện. Bộ sản phẩm grooming của chúng tôi có đầy đủ dụng cụ giúp bạn luôn lịch lãm, sảng khoái và tự tin.',
    bannerImg: '/assets/aistudio/manscaped_deals_banner_right.jpg',
  },
};

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category')?.toLowerCase();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeCategory = selectedCategory ?? (urlCategory || 'deals');

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-50' | '50-150' | 'over-150'>('all');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      setProducts(data || []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META.deals;

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory !== 'all') {
      list = list.filter((p) => {
        let catList: string[] = [];
        if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
          catList = p.categories.map((c) => c.trim().toLowerCase());
        } else if (p.category) {
          catList = p.category.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);
        }

        if (catList.length > 0) {
          if (activeCategory === 'deals') return catList.includes('deals') || catList.includes('combo');
          if (activeCategory === 'groin') return catList.includes('groin') || catList.includes('vung-kin');
          if (activeCategory === 'beard') return catList.includes('beard') || catList.includes('rau-mat');
          if (activeCategory === 'body') return catList.includes('body') || catList.includes('toc-toan-than');
        }

        const text = `${p.title} ${p.subtitle} ${p.badge || ''} ${(p.categoryPath || []).join(' ')}`.toLowerCase();
        if (activeCategory === 'deals') {
          return (
            text.includes('package') ||
            text.includes('kit') ||
            text.includes('bundle') ||
            text.includes('deal') ||
            text.includes('routine') ||
            text.includes('set')
          );
        }
        if (activeCategory === 'groin') {
          return text.includes('lawn mower') || text.includes('crop') || text.includes('groin') || text.includes('ball');
        }
        if (activeCategory === 'beard') {
          return text.includes('beard') || text.includes('hedger') || text.includes('face') || text.includes('chairman');
        }
        if (activeCategory === 'body') {
          return text.includes('body') || text.includes('weed') || text.includes('shed') || text.includes('nose') || text.includes('head');
        }
        return true;
      });
    }

    // Filter by Price range in VND
    if (priceFilter === 'under-50') {
      list = list.filter((p) => {
        const price = parseVND(p.regularPrice || p.vipPrice);
        return price < 500000;
      });
    } else if (priceFilter === '50-150') {
      list = list.filter((p) => {
        const price = parseVND(p.regularPrice || p.vipPrice);
        return price >= 500000 && price <= 1500000;
      });
    } else if (priceFilter === 'over-150') {
      list = list.filter((p) => {
        const price = parseVND(p.regularPrice || p.vipPrice);
        return price > 1500000;
      });
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        const pA = parseVND(a.regularPrice || a.vipPrice);
        const pB = parseVND(b.regularPrice || b.vipPrice);
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        const pA = parseVND(a.regularPrice || a.vipPrice);
        const pB = parseVND(b.regularPrice || b.vipPrice);
        return pB - pA;
      });
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, activeCategory, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col">
      <SuperBanner />
      <Header />

      {/* 1. HERO SPLIT BANNER (Exact Manscaped Style from Screenshot) */}
      <section className="w-full bg-[#141414] overflow-hidden select-none border-b border-black">
        <div className="w-full flex flex-col lg:flex-row min-h-[290px] sm:min-h-[310px] lg:h-[315px]">
          {/* Left Dark Content Box */}
          <div className="w-full lg:w-1/2 bg-[#141414] text-white flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-8 sm:py-12">
            <span className="text-[#c59b63] text-xs sm:text-[13px] font-extrabold tracking-[0.16em] uppercase mb-2 block">
              {meta.kicker}
            </span>
            <h1 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-none mb-3">
              {meta.title}
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm lg:text-[14.5px] leading-relaxed max-w-lg font-normal">
              {meta.desc}
            </p>
          </div>

          {/* Right Wide Image Box */}
          <div className="w-full lg:w-1/2 relative min-h-[200px] sm:min-h-[260px] lg:min-h-full overflow-hidden bg-[#cfb19d]">
            <Image
              src={meta.bannerImg}
              alt={meta.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. FILTERS & SORT BY TOOLBAR */}
      <div className="w-full bg-white border-b border-neutral-200/90 sticky top-[58px] sm:top-[68px] z-20 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between text-xs sm:text-sm text-neutral-800">
          {/* Left: Filters Button with Sliders Icon */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="flex items-center gap-2 font-bold text-neutral-900 hover:text-[#9e6f1c] transition-colors cursor-pointer group"
              aria-label="Toggle Filters"
            >
              <span className="text-sm font-semibold">Bộ lọc</span>
              {/* Manscaped Style Custom Sliders SVG Icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-[#9e6f1c] transition-colors"
              >
                <path d="M3 6h8M15 6h2M3 14h2M9 14h8" />
                <circle cx="13" cy="6" r="2" />
                <circle cx="7" cy="14" r="2" />
              </svg>
            </button>

            {/* Active Category Tag */}
            {activeCategory !== 'all' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200">
                <span>{CATEGORIES.find((c) => c.id === activeCategory)?.label}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Right: Sort By Dropdown (Matching Screenshot: Sort By: Featured ∨) */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-normal text-neutral-800">
            <span className="text-neutral-500 font-normal">Sắp xếp:</span>
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent font-medium text-neutral-900 pr-5 pl-1 py-1 outline-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-600 pointer-events-none absolute right-0 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Expandable Filters Panel */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-neutral-100 bg-[#faf9f6] px-4 sm:px-8 lg:px-12 py-4 overflow-hidden"
            >
              <div className="max-w-[1400px] mx-auto space-y-4">
                {/* Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 min-w-[90px]">
                    Danh mục:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const active = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                            active
                              ? 'bg-black text-white'
                              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 min-w-[90px]">
                    Mức giá:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'Tất cả mức giá' },
                      { id: 'under-50', label: 'Dưới 500.000đ' },
                      { id: '50-150', label: '500.000đ - 1.500.000đ' },
                      { id: 'over-150', label: 'Trên 1.500.000đ' },
                    ].map((p) => {
                      const active = priceFilter === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPriceFilter(p.id as any)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                            active
                              ? 'bg-[#9e6f1c] text-white font-bold'
                              : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. PRODUCT GRID (Exact 4-Column Presentation from Screenshot) */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 w-full">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-base font-semibold text-neutral-800">Không có sản phẩm nào phù hợp với bộ lọc.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setPriceFilter('all');
              }}
              className="text-xs font-bold text-[#9e6f1c] underline cursor-pointer"
            >
              Xóa bộ lọc để xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredAndSortedProducts.map((product) => {
              const displayPrice = formatVND(product.regularPrice || product.vipPrice);

              return (
                <div key={product.id} className="group flex flex-col">
                  {/* Square Image Box (Gray #f6f6f6 backdrop as in screenshot) */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative aspect-square w-full bg-[#f6f6f6] flex items-center justify-center overflow-hidden cursor-pointer rounded-xs"
                  >
                    {/* Centered High-Res Flat-lay Product Image */}
                    <div className="relative w-full h-full p-6 sm:p-7 flex items-center justify-center">
                      <Image
                        src={product.imageSrc}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={true}
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Link>

                  {/* Typography Details (Exact Manscaped Style from Screenshot) */}
                  <div className="mt-3.5 space-y-1">
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="font-bold text-[15px] sm:text-[15.5px] text-neutral-900 tracking-tight leading-snug line-clamp-1 group-hover:text-[#9e6f1c] transition-colors">
                        {product.title.replace(' - NEW!', '')}
                      </h3>
                    </Link>
                    <p className="text-[13px] text-neutral-500 line-clamp-1 font-normal leading-normal">
                      {product.subtitle}
                    </p>
                    <div className="pt-1">
                      <span className="font-bold text-[14.5px] text-neutral-900 tracking-tight">
                        {displayPrice}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Manscaped Guarantees Footer Strip */}
        <div className="mt-20 pt-12 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#f4f3ed] flex items-center justify-center text-[#9e6f1c]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Bảo Hành Chính Hãng 2 Năm</h4>
            <p className="text-xs text-neutral-500 max-w-xs">1 đổi 1 nhanh chóng nếu có lỗi từ nhà sản xuất.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#f4f3ed] flex items-center justify-center text-[#9e6f1c]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Miễn Phí Giao Hàng Toàn Quốc</h4>
            <p className="text-xs text-neutral-500 max-w-xs">Áp dụng cho mọi đơn hàng từ 500.000đ, đóng gói kín đáo.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#f4f3ed] flex items-center justify-center text-[#9e6f1c]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Cam Kết Hoàn Tiền 30 Ngày</h4>
            <p className="text-xs text-neutral-500 max-w-xs">Đổi trả không cần lý do nếu bạn chưa hài lòng.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-[#9e6f1c]">
          <div className="w-8 h-8 border-2 border-[#9e6f1c] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
