'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { featuredProductsConfig2, type ProductItem } from '@/config/products';
import { subscribeProducts } from '@/lib/dbService';
import { formatVND, parseVND, getProductPrices } from '@/lib/formatters';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setAllProducts(data || []);
    });
    return () => unsub();
  }, []);

  const freeShippingThreshold = 500000;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const progress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - totalPrice);

  // Suggested add-on items for "Ưu đãi mua kèm combo" - ONLY items belonging to 'deals' or 'combo' category
  const bundleItems = useMemo(() => {
    const isDealsOrCombo = (p: ProductItem) => {
      const titleLower = (p.title || '').toLowerCase();
      const catPathLower = (p.categoryPath || []).map((c) => c.toLowerCase());
      const catStr = [
        ...(Array.isArray(p.categories) ? p.categories : []),
        p.category || '',
        ...catPathLower,
      ].join(' ').toLowerCase();

      // Explicitly reject non-combo accessories, single tools, formulations or apparel
      if (
        titleLower.includes('shears') ||
        titleLower.includes('shed') ||
        titleLower.includes('boxers') ||
        titleLower.includes('scrub') ||
        titleLower.includes('mat') ||
        catStr.includes('dụng cụ') ||
        catStr.includes('apparel') ||
        catStr.includes('accessories') ||
        catStr.includes('formulations')
      ) {
        return false;
      }

      // Must belong to Deals, Combo, Package, Bundle, or Kit
      return (
        catStr.includes('ưu đãi') ||
        catStr.includes('combo') ||
        catStr.includes('deals') ||
        catStr.includes('kit') ||
        catStr.includes('bundle') ||
        catStr.includes('package')
      );
    };

    const dealsProducts = allProducts.filter(isDealsOrCombo);
    // Exclude items currently in cart to encourage buying new combos
    const cartIds = new Set(cart.map((item) => item.id));
    const availableDeals = dealsProducts.filter((p) => !cartIds.has(p.id));

    return availableDeals.length > 0 ? availableDeals : dealsProducts;
  }, [allProducts, cart]);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Determine real regular price and savings for each item from product config or cart item
  const getItemPricing = (item: (typeof cart)[0]) => {
    // 1. If item itself has numericOriginalPrice or originalPrice
    if (item.numericOriginalPrice && item.numericOriginalPrice > item.numericPrice) {
      const orig = item.numericOriginalPrice;
      return {
        regularPrice: orig,
        saving: orig - item.numericPrice,
        hasDiscount: true,
      };
    }
    if (item.originalPrice) {
      const parsedOrig = parseVND(item.originalPrice);
      if (parsedOrig > item.numericPrice) {
        return {
          regularPrice: parsedOrig,
          saving: parsedOrig - item.numericPrice,
          hasDiscount: true,
        };
      }
    }

    // 2. Lookup in allProducts by id
    const prod = allProducts.find((p) => p.id === item.id);
    if (prod) {
      // Check variants if variantName exists
      if (item.variantName && prod.variants && prod.variants.length > 0) {
        const v = prod.variants.find(
          (varItem) => varItem.name === item.variantName || varItem.id === item.variantName
        );
        if (v) {
          const vOrig = parseVND(v.originalPrice);
          const vPrice = parseVND(v.price);
          if (vOrig > vPrice) {
            return {
              regularPrice: vOrig,
              saving: vOrig - vPrice,
              hasDiscount: true,
            };
          }
        }
      }

      // Check product level vipPrice & regularPrice
      const { originalPrice } = getProductPrices(prod.vipPrice, prod.regularPrice);
      const parsedOrig = parseVND(originalPrice);
      if (parsedOrig > item.numericPrice) {
        return {
          regularPrice: parsedOrig,
          saving: parsedOrig - item.numericPrice,
          hasDiscount: true,
        };
      }
    }

    // 3. Default: item price is normal price (no fake markup)
    return {
      regularPrice: item.numericPrice,
      saving: 0,
      hasDiscount: false,
    };
  };

  // Estimate total product original value (MSRP before saving)
  const totalOriginalValue = cart.reduce((sum, item) => {
    const { regularPrice } = getItemPricing(item);
    return sum + regularPrice * item.quantity;
  }, 0);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        />

        {/* Slide-out Drawer Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-[440px] bg-white shadow-2xl flex flex-col font-sans select-none text-neutral-900"
          >
            {/* 1. Header with Manscaped Brand Brown Background */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#9c631b] text-white relative">
              <div className="w-6" /> {/* Spacer for optical center */}
              <h2 className="text-base font-bold tracking-wide text-center flex-1 font-sans">
                Giỏ hàng
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/15 transition-colors cursor-pointer"
                aria-label="Đóng giỏ hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              
              {/* Free Shipping Banner Card */}
              <div className="p-4 sm:p-5 pb-2">
                <div className="bg-[#f7f5ef] rounded-xl p-4 border border-[#ede9df]">
                  <div className="flex items-center space-x-2.5 text-xs text-neutral-800 mb-2.5">
                    {/* Delivery Stork / Delivery Illustration */}
                    <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-[#9c631b]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                        <path d="M2 17h2.5c.3 0 .6-.1.8-.3L8 14h5l1.5 2H22" strokeLinecap="round" />
                        <path d="M14 6l3 4h3l2 4v3h-2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="6.5" cy="18.5" r="2.5" />
                        <circle cx="17.5" cy="18.5" r="2.5" />
                        <path d="M9 10l-3-4H2v3h2l2 2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      {remainingForFree > 0 ? (
                        <span>
                          Mua thêm <strong className="text-[#9c631b] font-bold">{formatVND(remainingForFree)}</strong> để được <strong>Miễn phí vận chuyển!</strong>
                        </span>
                      ) : (
                        <span>Bạn đã đủ điều kiện <strong>Miễn phí vận chuyển!</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar with "Free" end pill */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#e8e4d8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#b27627] transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="bg-[#774712] text-white text-[10px] font-bold px-2 py-0.5 rounded leading-none">
                      Miễn phí
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart Items or Empty State */}
              {cart.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-[#f7f5ef] text-[#9c631b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-neutral-900 mb-1">
                    Giỏ hàng của bạn đang trống
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                    Khám phá ngay các dòng sản phẩm chăm sóc nam giới cao cấp từ MANFRESH.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#9c631b] hover:bg-[#865314] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition shadow-sm cursor-pointer"
                  >
                    Khám phá ngay
                  </button>
                </div>
              ) : (
                <div className="px-4 sm:px-5 space-y-4">
                  {/* Cart Title & Announcement */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-[#9c631b]">
                      Có {totalItems} sản phẩm trong giỏ hàng
                    </h3>
                    <p className="text-sm font-bold text-neutral-900 mt-2">
                      Chăm sóc diện mạo với ưu đãi tốt nhất.
                    </p>
                    <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed mt-1">
                      Sản phẩm chính hãng MANFRESH 100%. Bảo hành chính hãng 2 năm 1 đổi 1 và miễn phí giao hàng toàn quốc.
                    </p>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-4 pt-1">
                    {cart.map((item) => {
                      const { regularPrice, saving, hasDiscount } = getItemPricing(item);

                      return (
                        <div
                          key={`${item.id}-${item.variantName || 'default'}`}
                          className="flex gap-4 py-2"
                        >
                          {/* Image Box */}
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#f4f4f2] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-neutral-100">
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              sizes="128px"
                              className="object-contain p-2"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide block">
                                Giá ưu đãi
                              </span>
                              
                              {/* Product Title with Manscaped Brand Styling */}
                              <h4 className="font-extrabold text-sm sm:text-base uppercase leading-snug tracking-tight text-neutral-900 mt-0.5">
                                {item.title.toLowerCase().includes('lawn mower') ? (
                                  <span>
                                    THE LAWN MOWER<sup>®</sup>{' '}
                                    <span className="text-[#a0681c]">ULTRA GEN 6</span> GUNMETAL GRAY
                                  </span>
                                ) : (
                                  item.title
                                )}
                              </h4>

                              {/* Price Display: 1 giá gốc gạch và làm mờ + 1 giá khuyến mãi */}
                              <div className="mt-1 flex items-baseline space-x-2">
                                <span className="text-base font-bold text-[#a0681c]">
                                  {formatVND(item.numericPrice)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-neutral-400 line-through">
                                    {formatVND(regularPrice)}
                                  </span>
                                )}
                              </div>
                              {hasDiscount && saving > 0 && (
                                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                                  Tiết kiệm {formatVND(saving)}
                                </p>
                              )}
                            </div>

                            {/* Quantity Pill Controller with Trash Icon */}
                            <div className="mt-2.5">
                              <div className="inline-flex items-center border border-neutral-300 rounded-full px-3 py-1 bg-white shadow-xs space-x-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.quantity <= 1) {
                                      removeFromCart(item.id, item.variantName);
                                    } else {
                                      updateQuantity(item.id, item.quantity - 1, item.variantName);
                                    }
                                  }}
                                  className="text-neutral-700 hover:text-red-600 transition cursor-pointer p-0.5"
                                  title="Giảm / Xóa"
                                >
                                  {item.quantity <= 1 ? (
                                    <Trash2 className="w-4 h-4 text-neutral-800" />
                                  ) : (
                                    <span className="font-bold text-sm leading-none">–</span>
                                  )}
                                </button>
                                <span className="text-xs font-bold text-neutral-900 select-none min-w-[12px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantName)}
                                  className="text-neutral-700 hover:text-black transition cursor-pointer p-0.5"
                                  title="Tăng"
                                >
                                  <Plus className="w-3.5 h-3.5 text-neutral-800" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Bundle and Save Carousel Section */}
              <div className="mt-6 bg-[#f5f4ef] py-5 px-4 sm:px-5 border-t border-[#ede9df]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-sans font-bold text-base sm:text-lg text-neutral-900">
                    Ưu đãi mua kèm combo
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('left')}
                      className="w-7 h-7 rounded-full bg-[#e5e4de] hover:bg-[#d8d7d0] text-neutral-700 flex items-center justify-center transition cursor-pointer"
                      title="Trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('right')}
                      className="w-7 h-7 rounded-full bg-[#b37728] hover:bg-[#9c631b] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                      title="Sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrolling Card Track */}
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
                >
                  {bundleItems.map((prod) => {
                    const priceNum = parseInt((prod.regularPrice || prod.vipPrice || '0').replace(/[^0-9]/g, ''), 10) || 200000;

                    return (
                      <div
                        key={prod.id}
                        className="w-[200px] sm:w-[215px] flex-shrink-0 bg-white rounded-xl p-3.5 border border-neutral-200/80 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          {/* Centered Image */}
                          <div className="relative w-full h-32 bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                            <Image
                              src={prod.imageSrc}
                              alt={prod.title}
                              fill
                              sizes="180px"
                              className="object-contain p-1"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <h5 className="font-extrabold text-xs uppercase tracking-tight text-neutral-900 line-clamp-1 text-center">
                            {prod.title.toUpperCase()}
                          </h5>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 text-center mt-0.5 leading-tight min-h-[28px]">
                            {prod.subtitle}
                          </p>

                          {/* Pricing: 1 giá gốc gạch và làm mờ + 1 giá khuyến mãi */}
                          {(() => {
                            const { salePrice, originalPrice } = getProductPrices(prod.vipPrice, prod.regularPrice);
                            return (
                              <div className="flex items-baseline justify-center space-x-1.5 mt-2 flex-wrap">
                                <span className="text-sm font-bold text-[#a0681c]">
                                  {salePrice}
                                </span>
                                {originalPrice !== salePrice && (
                                  <span className="text-xs text-neutral-400 line-through">
                                    {originalPrice}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Round Add To Cart Pill Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const { salePrice, originalPrice } = getProductPrices(prod.vipPrice, prod.regularPrice);
                            addToCart({
                              id: prod.id,
                              title: prod.title,
                              subtitle: prod.subtitle,
                              price: salePrice,
                              numericPrice: parseVND(salePrice),
                              originalPrice: originalPrice,
                              numericOriginalPrice: parseVND(originalPrice),
                              quantity: 1,
                              imageSrc: prod.imageSrc,
                              variantName: 'Combo ưu đãi'
                            });
                          }}
                          className="mt-3 w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-2.5 px-4 rounded-full uppercase tracking-wider transition active:scale-[0.98] cursor-pointer"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Summary Breakdown Section */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <h4 className="font-bold text-sm text-neutral-900">Tóm tắt đơn hàng</h4>

                {/* Commitment Note */}
                <div className="flex items-start space-x-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                  <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-100/70 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-tight">
                    Cam kết sản phẩm chính hãng MANFRESH 100%. Bảo hành chính hãng 2 năm 1 đổi 1 và miễn phí giao hàng toàn quốc.
                  </p>
                </div>

                {/* Financial Totals Table */}
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tổng giá trị sản phẩm</span>
                    <span className="text-neutral-900 font-medium">
                      {formatVND(totalOriginalValue > totalPrice ? totalOriginalValue : totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính</span>
                    <span className="text-neutral-900 font-medium">{formatVND(totalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-neutral-900 font-medium">
                      {isFreeShipping ? 'Miễn phí' : '30.000đ'}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Thuế VAT</span>
                    <span className="text-neutral-500">Đã bao gồm trong giá</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Tổng thanh toán</span>
                    <span className="text-amber-800">{formatVND(totalPrice + (isFreeShipping ? 0 : 30000))}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. Sticky Footer: Trust Badges & Full-width Pill Checkout Button */}
            <div className="p-4 sm:p-5 bg-white border-t border-neutral-200 shadow-md">
              {/* 3 Trust Badges Exactly Like Screenshot */}
              <div className="grid grid-cols-3 gap-1 text-center py-1 mb-2">
                {/* 1. Money-Back Guarantee */}
                <div className="flex items-center justify-center space-x-1.5 px-1">
                  <RotateCcw className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                  <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-tight leading-none text-left">
                    CAM KẾT<br />HOÀN TIỀN
                  </span>
                </div>

                {/* 2. Free Shipping Over $49 */}
                <div className="flex items-center justify-center space-x-1.5 px-1 border-x border-neutral-200">
                  <Truck className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                  <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-tight leading-none text-left">
                    MIỄN PHÍ<br />GIAO HÀNG<br />ĐƠN TỪ 499K
                  </span>
                </div>

                {/* 3. 2-Year Warranty */}
                <div className="flex items-center justify-center space-x-1.5 px-1">
                  <ShieldCheck className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                  <span className="text-[9px] font-bold text-neutral-800 uppercase tracking-tight leading-none text-left">
                    BẢO HÀNH<br />2 NĂM
                  </span>
                </div>
              </div>

              {/* Checkout Pill Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#b77a2f] hover:bg-[#a26822] text-white font-bold py-3.5 px-6 rounded-full shadow-md transition-all active:scale-[0.99] flex items-center justify-center text-sm sm:text-base uppercase tracking-wider cursor-pointer mt-2"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
