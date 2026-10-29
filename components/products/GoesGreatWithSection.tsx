'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselPillNavigation from '@/components/common/CarouselPillNavigation';
import SectionHeader from '@/components/common/SectionHeader';
import { featuredProductsConfig2, type ProductItem } from '@/config/products';
import { formatVND } from '@/lib/formatters';

interface GoesGreatWithSectionProps {
  currentProductId?: string;
  title?: string;
  subtitle?: string;
}

export default function GoesGreatWithSection({
  currentProductId,
  title = 'Kết hợp hoàn hảo cùng...',
  subtitle = 'Các sản phẩm chăm sóc được yêu thích nhất để bạn luôn tỏa sáng.'
}: GoesGreatWithSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>(featuredProductsConfig2.products);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  // Real-time synchronization with Firestore products from Admin
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    import('@/lib/dbService')
      .then(({ subscribeProducts, seedInitialProductsIfNeeded }) => {
        if (!isMounted) return;
        seedInitialProductsIfNeeded().catch(() => {});
        unsubscribe = subscribeProducts((updatedProducts) => {
          if (isMounted && updatedProducts) {
            setProducts(updatedProducts);
          }
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Display items: recommend complementary products, placing current product at end or prioritizing others
  const displayProducts = React.useMemo(() => {
    if (!currentProductId) return products;
    const others = products.filter((p) => p.id !== currentProductId);
    const current = products.filter((p) => p.id === currentProductId);
    return others.length >= 3 ? [...others, ...current] : products;
  }, [products, currentProductId]);

  const totalItems = displayProducts.length;

  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
      setCurrentIndex(clampedIndex);

      const cardNode = container.children[clampedIndex] as HTMLElement;
      if (cardNode) {
        isProgrammaticScroll.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        container.scrollTo({
          left: cardNode.offsetLeft - 16,
          behavior: 'smooth',
        });

        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 500);
      }
    }
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    const nextIndex = Math.max(0, currentIndex - 1);
    scrollToCard(nextIndex);
  }, [currentIndex, scrollToCard]);

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(totalItems - 1, currentIndex + 1);
    scrollToCard(nextIndex);
  }, [currentIndex, totalItems, scrollToCard]);

  // Keep currentIndex synchronized with user scroll
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !containerRef.current) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let minDiff = Infinity;

    children.forEach((child, index) => {
      const diff = Math.abs(child.offsetLeft - 16 - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const timeTaken = Date.now() - touchStartTime.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      const isFastFlick = timeTaken < 300 && Math.abs(diffX) > 25;
      const isStandardSwipe = Math.abs(diffX) > 40;

      if (isFastFlick || isStandardSwipe) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // Limit dots display if there are many products
  const maxDots = Math.min(totalItems, 6);
  const dots = Array.from({ length: maxDots }, (_, i) => i);

  return (
    <section 
      aria-label="Gợi ý kết hợp hoàn hảo"
      className="w-full bg-transparent py-16 sm:py-20 lg:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
        />

        {/* Carousel Container */}
        <div className="w-full relative">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-stretch gap-5 sm:gap-6 lg:gap-7 overflow-x-auto no-scrollbar pb-4 px-2 sm:px-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayProducts.map((product, idx) => {
              const productHref = (!product.href || product.href === '#' || product.href === '') 
                ? `/products/${product.id}` 
                : product.href;

              const isNew = product.badge?.toLowerCase().includes('new') || idx === 0 || idx === 1;
              const isSale = product.badge?.toLowerCase().includes('sale') || product.id === 'the-shears-2';

              return (
                <div 
                  key={product.id || idx} 
                  className="flex-shrink-0 w-[240px] sm:w-[270px] lg:w-[285px] snap-start flex flex-col group/card"
                >
                  {/* Square Image Container with Light Gray Background */}
                  <Link
                    href={productHref}
                    className="relative w-full aspect-square bg-[#f5f5f5] rounded-[2px] overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover/card:bg-[#efefef]"
                  >
                    {/* Badge on Card */}
                    {isNew && (
                      <span className="absolute top-3 left-3 z-10 bg-[#1c2c4c] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider">
                        New
                      </span>
                    )}

                    {isSale && (
                      <span className="absolute top-3 right-3 z-10 bg-[#cc1414] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider">
                        Sale
                      </span>
                    )}

                    {/* Centered Product Image */}
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt || product.title}
                        fill
                        sizes="(max-width: 640px) 240px, 285px"
                        unoptimized={true}
                        className="object-contain p-2 transition-transform duration-500 ease-out group-hover/card:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <Link
                      href={productHref}
                      className="text-neutral-900 text-sm sm:text-base font-bold tracking-tight hover:underline line-clamp-1"
                      title={product.title}
                    >
                      {product.title}
                    </Link>

                    <p className="text-neutral-500 text-xs font-normal line-clamp-1 mt-0.5">
                      {product.subtitle}
                    </p>

                    {/* Clean Pricing in VND */}
                    <div className="flex items-baseline gap-2 pt-2.5 text-xs sm:text-sm">
                      <span className="text-neutral-900 font-bold text-sm sm:text-base">
                        {formatVND(product.regularPrice || product.vipPrice)}
                      </span>
                    </div>

                    {/* Discount Notice (if Sale) */}
                    {isSale && (
                      <div className="text-[#cc1414] font-bold text-xs uppercase tracking-wider mt-1.5">
                        SAVE 30%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Brown Pill Navigation Bar (matching image_6888aa00.png) */}
          <CarouselPillNavigation
            currentIndex={currentIndex}
            totalItems={totalItems}
            onPrev={handlePrev}
            onNext={handleNext}
            onSelect={scrollToCard}
            className="mt-10"
          />

        </div>

      </div>
    </section>
  );
}
