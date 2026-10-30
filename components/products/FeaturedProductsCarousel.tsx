'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ProductCard from './ProductCard';
import { type FeaturedProductsConfig, type ProductItem } from '@/config/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselPillNavigation from '@/components/common/CarouselPillNavigation';
import SectionHeader from '@/components/common/SectionHeader';
interface FeaturedProductsSectionProps {
  config: FeaturedProductsConfig;
}

export default function FeaturedProductsSection({ config }: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    import('@/lib/dbService').then(({ subscribeProducts }) => {
      if (!isMounted) return;
      unsubscribe = subscribeProducts((updatedProducts) => {
        if (isMounted) {
          setProducts(updatedProducts || []);
          setIsLoading(false);
        }
      });
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

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

  // Touch gesture tracking for snappy mobile swipe
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const totalItems = products.length;

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
          left: cardNode.offsetLeft - (container.clientWidth - cardNode.offsetWidth) / 2,
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
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let minDiff = Infinity;

    children.forEach((child, index) => {
      const cardCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(containerCenter - cardCenter);
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

    // Primarily horizontal swipe
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

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured Products"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          title={config.sectionTitle}
          subtitle={config.sectionSubtitle}
        />

        {/* Carousel Container */}
        <div className="w-full relative">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6 lg:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[360px] lg:w-[400px] snap-center">
                <ProductCard product={product} />
              </div>
            ))}
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
