'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselPillNavigationProps {
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  maxDots?: number;
  className?: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function CarouselPillNavigation({
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  onSelect,
  maxDots = 6,
  className = '',
  prevDisabled,
  nextDisabled,
}: CarouselPillNavigationProps) {
  const visibleDotsCount = Math.min(totalItems, maxDots);
  const dots = Array.from({ length: visibleDotsCount }, (_, i) => i);

  const isPrevDisabled = prevDisabled !== undefined ? prevDisabled : currentIndex === 0;
  const isNextDisabled = nextDisabled !== undefined ? nextDisabled : currentIndex >= totalItems - 1;

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <div className="inline-flex items-center bg-[#8c531b] hover:bg-[#7b4613] text-white px-4 py-2 rounded-full shadow-md space-x-3 transition-colors">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className={`p-1 rounded-full transition-all flex items-center justify-center ${
            isPrevDisabled
              ? 'text-white/40 cursor-not-allowed opacity-50'
              : 'text-white hover:text-amber-200 cursor-pointer active:scale-95'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center space-x-2 px-1">
          {dots.map((dotIdx) => {
            const isActive = Math.min(currentIndex, visibleDotsCount - 1) === dotIdx;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={() => onSelect(dotIdx)}
                className={`transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'w-2 h-2 rounded-full bg-white scale-110 shadow-xs'
                    : 'w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`p-1 rounded-full transition-all flex items-center justify-center ${
            isNextDisabled
              ? 'text-white/40 cursor-not-allowed opacity-50'
              : 'text-white hover:text-amber-200 cursor-pointer active:scale-95'
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
