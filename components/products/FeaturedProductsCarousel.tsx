'use client';

import { useState, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import { type FeaturedProductsConfig, type ProductItem } from '@/config/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedProductsSectionProps {
  config: FeaturedProductsConfig;
}

export default function FeaturedProductsSection({ config }: FeaturedProductsSectionProps) {
  const [products] = useState<ProductItem[]>(config.products);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalItems = products.length;

  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cardNode = container.children[index] as HTMLElement;
      if (cardNode) {
        container.scrollTo({
          left: cardNode.offsetLeft - (container.clientWidth - cardNode.offsetWidth) / 2,
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

  return (
    <section
      aria-label="Featured Products"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 select-none overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#583927] tracking-tight mb-2">
            {config.sectionTitle}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base font-normal">
            {config.sectionSubtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full relative">
          <div
            ref={containerRef}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6 lg:px-12 snap-x snap-mandatory scroll-smooth [scroll-behavior:smooth]"
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[360px] lg:w-[400px] snap-center">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                currentIndex === 0 ? 'bg-neutral-300 opacity-50' : 'bg-[#b98141] hover:bg-[#a57134] text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    scrollToCard(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'bg-[#b98141] w-4' : 'bg-neutral-300 w-2'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalItems - 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                currentIndex === totalItems - 1 ? 'bg-neutral-300 opacity-50' : 'bg-[#b98141] hover:bg-[#a57134] text-white'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
