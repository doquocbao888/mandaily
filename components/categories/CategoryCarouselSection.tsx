'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselPillNavigation from '@/components/common/CarouselPillNavigation';
import { categoryCarouselConfig, type CategoryCarouselConfig } from '@/config/categories';

interface CategoryCarouselSectionProps {
  config?: CategoryCarouselConfig;
}

export default function CategoryCarouselSection({
  config = categoryCarouselConfig,
}: CategoryCarouselSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch tracking
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const totalItems = config.items.length;

  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
      setCurrentIndex(clampedIndex);

      const cards = container.children;
      if (cards[clampedIndex]) {
        isProgrammaticScroll.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const cardNode = cards[clampedIndex] as HTMLElement;
        const containerWidth = container.clientWidth;
        const cardWidth = cardNode.offsetWidth;
        const cardLeft = cardNode.offsetLeft;
        const targetScroll = cardLeft - (containerWidth - cardWidth) / 2;

        container.scrollTo({
          left: targetScroll,
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

  // Synchronize index when scrolling
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
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

  return (
    <section
      aria-label="Category Carousel"
      className="w-full bg-[#f8f7f2] py-16 sm:py-20 lg:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Heading & Shop All Button */}
        <div className="text-center mb-12 sm:mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#1a1a1a] tracking-tight leading-[1.15] mb-6 whitespace-pre-line">
            {config.sectionTitle}
          </h2>
          <div>
            <Link
              href={config.shopAllHref}
              className="inline-flex items-center justify-center bg-[#b98141] hover:bg-[#a57134] text-white text-sm font-bold px-8 py-2.5 rounded-full transition-colors duration-200 shadow-xs cursor-pointer"
            >
              {config.shopAllText}
            </Link>
          </div>
        </div>

        {/* Scrollable Container with drag support */}
        <div className="w-full relative">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6 lg:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {config.items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[280px] sm:w-[360px] lg:w-[400px] snap-start flex flex-col group"
              >
                {/* Image Card */}
                <Link
                  href={item.ctaHref}
                  draggable={false}
                  className="relative w-full aspect-[1/1] rounded-[4px] overflow-hidden bg-[#e6e4dc] mb-4 block pointer-events-auto"
                >
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 400px"
                    quality={100}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] pointer-events-none"
                  />
                </Link>

                {/* Card Title & CTA */}
                <div className="flex flex-col space-y-1">
                  <Link
                    href={item.ctaHref}
                    className="text-neutral-900 text-lg sm:text-xl font-bold tracking-tight hover:underline underline-offset-4"
                  >
                    {item.title}
                  </Link>
                  <Link
                    href={item.ctaHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-800 hover:text-black transition-colors pt-1"
                  >
                    <span>Shop now</span>
                    <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
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
