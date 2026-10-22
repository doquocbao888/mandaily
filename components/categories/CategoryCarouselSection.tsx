'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryCarouselConfig, type CategoryCarouselConfig } from '@/config/categories';

interface CategoryCarouselSectionProps {
  config?: CategoryCarouselConfig;
}

export default function CategoryCarouselSection({
  config = categoryCarouselConfig,
}: CategoryCarouselSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const totalItems = config.items.length;

  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cards = container.children;
      if (cards[index]) {
        const cardNode = cards[index] as HTMLElement;
        const containerWidth = container.clientWidth;
        const cardWidth = cardNode.offsetWidth;
        const cardLeft = cardNode.offsetLeft;
        // Center the card or align left
        const targetScroll = cardLeft - (containerWidth - cardWidth) / 2;
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  const handlePrev = () => {
    const nextIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(nextIndex);
    scrollToCard(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = Math.min(totalItems - 1, currentIndex + 1);
    setCurrentIndex(nextIndex);
    scrollToCard(nextIndex);
  };

  // Mouse / Touch drag handlers for single-item snapping
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);

    // Snap to closest card index
    const container = containerRef.current;
    const scrollPos = container.scrollLeft;
    const cards = container.children;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const cardNode = cards[i] as HTMLElement;
      const cardLeft = cardNode.offsetLeft;
      const diff = Math.abs(cardLeft - scrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    setCurrentIndex(closestIndex);
    scrollToCard(closestIndex);
  }, [isDragging, scrollToCard]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, handleDragEnd]);

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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6 lg:px-12 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none scroll-smooth [scroll-behavior:smooth]"
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

          {/* Carousel Pagination & Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                currentIndex === 0
                  ? 'bg-neutral-300 opacity-50 cursor-not-allowed'
                  : 'bg-[#b98141] hover:bg-[#a57134]'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 px-2">
              {config.items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    scrollToCard(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'bg-[#b98141] w-4' : 'bg-neutral-300 w-2 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === totalItems - 1}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                currentIndex === totalItems - 1
                  ? 'bg-neutral-300 opacity-50 cursor-not-allowed'
                  : 'bg-[#b98141] hover:bg-[#a57134]'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
