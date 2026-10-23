'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, type ProductItem } from '@/config/products';
import SuperBanner from '@/components/header/SuperBanner';
import Header from '@/components/header/Header';
import VideoReviewsSection from '@/components/products/VideoReviewsSection';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const initialProduct = getProductById(id);

  const [product, setProduct] = useState<ProductItem | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<'vip' | 'regular'>('vip');
  const [quantity, setQuantity] = useState(1);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileThumbnailsRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const fallbackProduct = initialProduct || getProductById(id) || {
    id: id || 'default',
    title: 'The Lawn Mower® Ultra Gen 6',
    subtitle: 'Groin & Body Hair Trimmer',
    categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Lawn Mower® Ultra Gen 6'],
    vipPrice: '$109.99',
    regularPrice: '$119.99',
    href: `/products/${id || 'lawn-mower-ultra-6'}`,
    imageSrc: '/assets/aistudio/30-00006-NA_f201a618.png',
    imageAlt: 'The Lawn Mower Ultra Gen 6 Trimmer with blade attachment',
    thumbnails: [
      '/assets/aistudio/30-00006-NA_f201a618.png',
      '/assets/aistudio/25aaeee852d4_1a4c043f.webp',
      '/assets/aistudio/b72c1da980f6_e399d627.webp',
      '/assets/aistudio/e25de805d015_f449fce7.webp',
      '/assets/aistudio/e38aa911b5e9_8252c23e.webp',
      '/assets/aistudio/fac0fd606c51_4d3a1ba2.webp',
      '/assets/aistudio/685d42568afa_98fc3951.webp',
      '/assets/aistudio/25106398e899_13ff16c1.webp',
    ],
    rating: 5.0,
    reviewCount: '1,671 đánh giá',
    soldCount: 'Đã bán 75.8k',
    shortDescription: 'Máy cạo lông vùng kín chuyên dụng cao cấp, chống nước IPX7.',
    highlights: ['Sạch chỉ 1 lần lướt', 'Không đau, không xước (SkinSafe™)', 'Da mịn, không ngứa rát'],
    reviewSample: { author: 'Chi Hùng', rating: 5, comment: 'Sản phẩm tuyệt vời.' },
    variants: [],
    gifts: [],
    cashbackText: '',
    warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
  };

  const rawThumbs = (product?.thumbnails || []).filter(
    (t) => typeof t === 'string' && t.trim().length > 0
  );
  const currentThumbnails = rawThumbs.length > 0
    ? rawThumbs
    : (fallbackProduct.thumbnails && fallbackProduct.thumbnails.length > 0
        ? fallbackProduct.thumbnails
        : ['/assets/aistudio/30-00006-NA_f201a618.png']);

  const DEFAULT_IMAGE = '/assets/aistudio/30-00006-NA_f201a618.png';
  const SECONDARY_IMAGE = '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg';

  const getImageSrc = (src?: string, fallbackSrc?: string) => {
    const fallback = fallbackSrc || fallbackProduct.imageSrc || DEFAULT_IMAGE;
    if (!src || src.trim().length === 0 || failedImages[src]) {
      if (failedImages[fallback]) {
        return SECONDARY_IMAGE;
      }
      return fallback;
    }
    return src;
  };

  const handleImageError = (failedSrc?: string) => {
    if (!failedSrc) return;
    setFailedImages((prev) => {
      if (prev[failedSrc]) return prev;
      return { ...prev, [failedSrc]: true };
    });
  };

  const isUnoptimized = (src?: string) => {
    if (!src) return false;
    return src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://');
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    const container = e.currentTarget;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (
        newIndex >= 0 &&
        newIndex < currentThumbnails.length &&
        newIndex !== selectedImageIndex
      ) {
        setSelectedImageIndex(newIndex);
      }
    }
  };

  const handleSelectImage = (idx: number) => {
    setSelectedImageIndex(idx);
    if (mobileScrollRef.current) {
      isScrollingRef.current = true;
      const width = mobileScrollRef.current.clientWidth;
      mobileScrollRef.current.scrollTo({
        left: idx * width,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 350);
    }
  };

  useEffect(() => {
    if (mobileThumbnailsRef.current) {
      const activeThumb = mobileThumbnailsRef.current.children[selectedImageIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    let unsub: (() => void) | undefined;

    import('@/lib/dbService').then(({ subscribeProductById }) => {
      if (!isMounted) return;
      unsub = subscribeProductById(id, (updatedProd) => {
        if (isMounted) {
          if (updatedProd) {
            const defaultProd = getProductById(id);
            const rawT = (updatedProd.thumbnails || []).filter(
              (t) => typeof t === 'string' && t.trim().length > 0
            );
            const safeT = rawT.length > 0
              ? rawT
              : (defaultProd?.thumbnails || [updatedProd.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png']);

            setProduct({
              ...defaultProd,
              ...updatedProd,
              imageSrc: updatedProd.imageSrc || defaultProd?.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png',
              thumbnails: safeT,
            });
          }
          setLoading(false);
        }
      });
    }).catch((err) => {
      console.warn('Could not load dbService in useEffect:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      if (unsub) {
        try {
          unsub();
        } catch {
          // ignore
        }
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    setAddedToast(true);
    // Create new order in Firestore cloud database
    try {
      const { createOrderInDb } = await import('@/lib/dbService');
      await createOrderInDb({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: 'Khách hàng mới',
        phone: '0909' + Math.floor(100000 + Math.random() * 900000),
        address: 'Hồ Chí Minh, Việt Nam',
        productName: product.title,
        variant: selectedVariant === 'vip' ? 'VIP Member Price' : 'Regular Price',
        quantity: quantity,
        totalPrice: selectedVariant === 'vip' ? product.vipPrice : product.regularPrice,
        status: 'Đang xử lý',
        createdAt: new Date().toLocaleString('vi-VN'),
      });
    } catch (e) {
      console.error('Failed to create order:', e);
    }
    setTimeout(() => setAddedToast(false), 3500);
  };


  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1a1a1a] flex flex-col font-sans select-none">
      <SuperBanner />
      <Header />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1e1e1e] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-amber-500/30 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Đã thêm vào giỏ hàng thành công!</p>
            <p className="text-xs text-neutral-300">{product.title} ({selectedVariant === 'vip' ? 'VIP Member' : 'Regular Price'})</p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Product Layout matching Manscaped reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* Desktop Gallery: Vertical Thumbnails on Left + Large Main Image (Retained 100% intact for desktop) */}
          <div className="hidden sm:flex lg:col-span-7 sm:flex-row gap-3 sm:gap-4 items-start">
            
            {/* Vertical Thumbnail List on Left (Compact size & subtle custom scrollbar) */}
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[620px] lg:max-h-[680px] flex-shrink-0 w-full sm:w-[64px] md:w-[70px] pb-2 sm:pb-0 sm:pr-1 [scrollbar-width:thin] [scrollbar-color:#d4d4d4_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {currentThumbnails.map((thumb, idx) => {
                const resolvedThumb = getImageSrc(thumb);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-13 h-13 sm:w-[56px] sm:h-[56px] md:w-[62px] md:h-[62px] rounded-lg overflow-hidden border-2 transition-all bg-[#f2f1ec] ${
                      selectedImageIndex === idx 
                        ? 'border-neutral-900 ring-2 ring-neutral-900/10 scale-[1.03] shadow-sm' 
                        : 'border-neutral-200/80 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={resolvedThumb}
                      alt={`Thumbnail ${idx}`}
                      fill
                      sizes="64px"
                      unoptimized={isUnoptimized(resolvedThumb)}
                      onError={() => handleImageError(thumb)}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Image Box (Enlarged with generous aspect ratio & min-height) */}
            <div className="relative flex-1 w-full aspect-[1/1] sm:aspect-[4/4.2] min-h-[380px] sm:min-h-[520px] lg:min-h-[620px] xl:min-h-[660px] bg-[#f5f3ec] rounded-2xl overflow-hidden flex items-center justify-center p-0 border border-neutral-200/80 shadow-sm group">
              
              {/* Top-Left 'New' Badge */}
              <div className="absolute top-4 left-4 z-10 bg-[#1c2833] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-bold tracking-wider uppercase shadow-xs">
                New
              </div>

              {/* Main Image Display */}
              <div className="relative w-full h-full flex items-center justify-center">
                {(() => {
                  const targetSrc = currentThumbnails[selectedImageIndex] || product?.imageSrc || fallbackProduct.imageSrc;
                  const resolvedMain = getImageSrc(targetSrc);
                  return (
                    <Image
                      src={resolvedMain}
                      alt={product?.imageAlt || fallbackProduct.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 850px"
                      unoptimized={isUnoptimized(resolvedMain)}
                      onError={() => handleImageError(targetSrc)}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  );
                })()}
              </div>

            </div>
          </div>

          {/* Mobile Gallery: Main Image on top (swipeable horizontally) + Thumbnails collection underneath */}
          <div className="sm:hidden flex flex-col gap-3 w-full">
            {/* Main Image Box on Mobile with Horizontal Swipe */}
            <div className="relative w-full aspect-square min-h-[300px] bg-[#f5f3ec] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm">
              {/* Top-Left 'New' Badge */}
              <div className="absolute top-3 left-3 z-20 bg-[#1c2833] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-bold tracking-wider uppercase shadow-xs pointer-events-none">
                New
              </div>

              {/* Top-Right Image Counter */}
              <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider pointer-events-none">
                {selectedImageIndex + 1} / {currentThumbnails.length}
              </div>

              {/* Swipeable Horizontal Slider */}
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
              >
                {currentThumbnails.map((img, idx) => {
                  const resolvedImg = getImageSrc(img);
                  return (
                    <div key={idx} className="relative min-w-full w-full h-full snap-center flex-shrink-0">
                      <Image
                        src={resolvedImg}
                        alt={`${product?.imageAlt || fallbackProduct.imageAlt} ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        sizes="100vw"
                        unoptimized={isUnoptimized(resolvedImg)}
                        onError={() => handleImageError(img)}
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Left / Right Quick Navigation Buttons on Mobile */}
              {currentThumbnails.length > 1 && (
                <>
                  {selectedImageIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSelectImage(selectedImageIndex - 1)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 shadow-md flex items-center justify-center text-neutral-800 active:scale-95 transition-transform"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {selectedImageIndex < currentThumbnails.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleSelectImage(selectedImageIndex + 1)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 shadow-md flex items-center justify-center text-neutral-800 active:scale-95 transition-transform"
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}

              {/* Dots indicator at the bottom */}
              <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center space-x-1.5 pointer-events-none">
                {currentThumbnails.map((_, idx) => (
                  <span
                    key={idx}
                    className={`transition-all duration-300 rounded-full ${
                      selectedImageIndex === idx
                        ? 'w-5 h-1.5 bg-neutral-900 shadow-xs'
                        : 'w-1.5 h-1.5 bg-neutral-400/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails Collection positioned BELOW the Main Image on Mobile */}
            <div
              ref={mobileThumbnailsRef}
              className="flex space-x-2.5 overflow-x-auto w-full py-1 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {currentThumbnails.map((thumb, idx) => {
                const resolvedThumb = getImageSrc(thumb);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectImage(idx)}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-[#f2f1ec] ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 ring-2 ring-neutral-900/20 scale-[1.03] shadow-sm'
                        : 'border-neutral-200/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={resolvedThumb}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="56px"
                      unoptimized={isUnoptimized(resolvedThumb)}
                      onError={() => handleImageError(thumb)}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Title, Guarantee Badge, Pricing & Variant Cards */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Header Area with 30-Day Guarantee Badge on Top Right */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight uppercase">
                  {product.title.replace(' - NEW!', '')}
                </h1>
                <p className="text-neutral-600 text-sm font-medium mt-1">
                  {product.subtitle}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-xl font-extrabold text-neutral-900">$109.99</span>
                  <span className="text-neutral-400 line-through text-sm">$119.99</span>
                  <span className="bg-[#b78103] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    VIPs SAVE 8%
                  </span>
                </div>
              </div>

              {/* 30-Day Money Back Guarantee Seal Badge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-amber-600/60 rounded-full p-2 text-center bg-amber-50/40 shadow-sm">
                <div className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-bold text-amber-900 uppercase leading-tight">
                  <ShieldCheck className="w-5 h-5 text-amber-700 mb-0.5" />
                  <span>30 Day</span>
                  <span>Money Back</span>
                  <span>Guarantee</span>
                </div>
              </div>
            </div>

            {/* View FAQs */}
            <div className="mt-3 mb-5">
              <a href="#faqs" className="text-xs sm:text-sm font-semibold text-neutral-800 underline underline-offset-4 hover:text-amber-700">
                View FAQs
              </a>
            </div>

            {/* Variant Option 1: VIP Member Price (Selected Card) */}
            <div 
              onClick={() => setSelectedVariant('vip')}
              className={`border-2 rounded-2xl p-5 mb-4 cursor-pointer transition-all bg-white ${
                selectedVariant === 'vip' 
                  ? 'border-amber-600 shadow-md ring-1 ring-amber-600/20' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input 
                    type="radio" 
                    name="pricing-option" 
                    checked={selectedVariant === 'vip'} 
                    onChange={() => setSelectedVariant('vip')}
                    className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer" 
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm sm:text-base text-neutral-900">THE LAWN MOWER® ULTRA GEN 6</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-neutral-800">VIP Member Price</span>
                      <span className="bg-[#b78103] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        VIPs SAVE 8%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-neutral-900">$109.99</div>
                  <div className="text-xs text-neutral-400 line-through">$119.99</div>
                </div>
              </div>

              {/* Expanded details when VIP is selected */}
              {selectedVariant === 'vip' && (
                <div className="mt-4 pt-4 border-t border-neutral-100 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-700 font-medium mb-4">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 overflow-hidden h-12">
                      <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                        className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-neutral-900 text-sm">{quantity}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                        className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                      className="flex-1 bg-[#b78103] hover:bg-[#a17102] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm sm:text-base uppercase tracking-wider"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to cart</span>
                    </button>
                  </div>

                  {/* Subscription explanation text */}
                  <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed mb-3">
                    The VIP Member Price option enrolls you in a VIP Package subscription, which includes both a fresh trimmer blade and foil blade refill, billed at $25.00 + tax every 3 months. Customize or cancel anytime.
                  </p>

                  {/* Already a member toggle */}
                  <div className="pt-2 border-t border-neutral-100">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowMemberDropdown(!showMemberDropdown); }}
                      className="flex items-center justify-between w-full text-xs font-bold text-neutral-800 hover:text-amber-700 py-1"
                    >
                      <span>Already a member?</span>
                      {showMemberDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showMemberDropdown && (
                      <div className="mt-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                        Please log in to your account to apply your existing VIP membership pricing and benefits automatically.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Variant Option 2: Regular Price Card */}
            <div 
              onClick={() => setSelectedVariant('regular')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all bg-white ${
                selectedVariant === 'regular' 
                  ? 'border-neutral-900 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="pricing-option" 
                    checked={selectedVariant === 'regular'} 
                    onChange={() => setSelectedVariant('regular')}
                    className="accent-neutral-900 w-4 h-4 cursor-pointer" 
                  />
                  <span className="font-bold text-sm sm:text-base text-neutral-900">Regular Price</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-neutral-900">$119.99</div>
              </div>

              {selectedVariant === 'regular' && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
                  >
                    <span>Add to cart (Regular Price)</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Next Section: UGC Video Reviews 'The buzz is real' */}
        <VideoReviewsSection reviews={product?.videoReviews} />

      </main>
    </div>
  );
}
