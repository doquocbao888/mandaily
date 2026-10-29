'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CarouselPillNavigation from '@/components/common/CarouselPillNavigation';
import SectionHeader from '@/components/common/SectionHeader';

interface TechItem {
  id: string;
  imageSrc: string;
  imageAlt: string;
  productImg: string;
  productTitle: string;
  productSubtitle: string;
  title: string;
  description: string;
}

const techItems: TechItem[] = [
  {
    id: 'motors',
    imageSrc: '/assets/aistudio/homepage-superbowl_spotlight-gallery_1-motors-cover_desktop_cdbcdc42.jpg',
    imageAlt: 'Động cơ mạnh mẽ hàng đầu',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'The Lawn Mower® Ultra Gen 6',
    productSubtitle: 'Tông đơ cắt tỉa lông vùng kín & toàn thân đỉnh cao',
    title: 'Động cơ mạnh mẽ, dẫn đầu phân khúc',
    description: 'Vòng tua RPM ổn định liên tục giúp lưỡi cắt không bị nghẽn hay giảm tốc độ, đảm bảo sức mạnh vượt trội từ nhát cạo đầu tiên đến đường tỉa cuối cùng.',
  },
  {
    id: 'skinsafe',
    imageSrc: '/assets/aistudio/homepage-superbowl_spotlight-gallery_2-skinsafe_desktop_c51e21b6.jpg',
    imageAlt: 'Công nghệ lưỡi an toàn SkinSafe',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'The Chairman® Pro',
    productSubtitle: 'Máy cạo râu lá điện tử cao cấp',
    title: 'Công nghệ lưỡi cạo an toàn SkinSafe®',
    description: 'Thiết kế bo tròn giúp cạo sát tận gốc nhưng hạn chế tối đa nguy cơ trầy xước và đau rát, mang lại sự tự tin tuyệt đối cho phái mạnh.\n*Công nghệ SkinSafe® tối ưu hóa độ êm ái khi cạo.',
  },
  {
    id: 'waterproof',
    imageSrc: '/assets/aistudio/homepage-superbowl_spotlight-gallery_3-waterproof_desktop_975e5290.jpg',
    imageAlt: 'Thiết kế chống nước IPX7',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'Weed Whacker® 3.0 Pro',
    productSubtitle: 'Tông đơ tỉa lông mũi, tai & lông mày',
    title: 'Thiết kế chống nước hoàn toàn IPX7',
    description: 'Thoải mái cạo tỉa khi đang tắm hoặc cạo khô tùy thích. Đạt chuẩn kháng nước IPX7 bảo vệ thiết bị an toàn tuyệt đối ngay cả khi ngâm dưới nước.',
  },
];

export default function GameChangingTechSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch gesture tracking for effortless responsive swiping on mobile
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const scrollToCard = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, techItems.length - 1));
    setActiveIndex(clampedIndex);

    const node = itemRefs.current[clampedIndex];
    const container = scrollContainerRef.current;
    if (node && container) {
      isProgrammaticScroll.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const targetLeft = node.offsetLeft - (container.clientWidth - node.offsetWidth) / 2;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
    }
  }, []);

  const handlePrev = useCallback(() => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : techItems.length - 1;
    scrollToCard(nextIdx);
  }, [activeIndex, scrollToCard]);

  const handleNext = useCallback(() => {
    const nextIdx = activeIndex < techItems.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(nextIdx);
  }, [activeIndex, scrollToCard]);

  // Sync activeIndex whenever user scrolls with touch or mouse
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDiff = Infinity;

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const cardCenter = ref.offsetLeft + ref.offsetWidth / 2;
        const diff = Math.abs(containerCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  // Touch gesture handlers for quick, light swipes
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

    // Only trigger if primarily horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Swipe threshold: 40px or fast flick under 300ms
      const isFastFlick = timeTaken < 300 && Math.abs(diffX) > 25;
      const isStandardSwipe = Math.abs(diffX) > 40;

      if (isFastFlick || isStandardSwipe) {
        if (diffX > 0) {
          // Swipe left -> go to next slide
          if (activeIndex < techItems.length - 1) {
            scrollToCard(activeIndex + 1);
          }
        } else {
          // Swipe right -> go to previous slide
          if (activeIndex > 0) {
            scrollToCard(activeIndex - 1);
          }
        }
      }
    }
  };

  // Center initial active card on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCard(0);
    }, 100);
    return () => clearTimeout(timer);
  }, [scrollToCard]);

  return (
    <section className="relative w-full bg-[#f7f4ee] py-14 sm:py-20 lg:py-24 overflow-hidden select-none">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title="Công nghệ đột phá nâng tầm trải nghiệm."
          subtitle="Được thiết kế tỉ mỉ mang đến sự an toàn, chính xác và đẳng cấp tuyệt đối cho phái mạnh."
        />

        {/* Scrollable Peek Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none px-[6vw] sm:px-[10vw] py-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {techItems.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => scrollToCard(index)}
                className={`snap-center flex-shrink-0 w-[84vw] sm:w-[580px] lg:w-[720px] cursor-pointer transition-all duration-300 ease-out flex flex-col ${
                  isActive
                    ? 'scale-100 opacity-100 z-20 shadow-2xl'
                    : 'scale-[0.92] sm:scale-[0.90] opacity-60 hover:opacity-85 z-10'
                }`}
              >
                {/* Image Card */}
                <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 600px, 720px"
                    quality={100}
                    priority={index === 0}
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating Product Pill at Bottom Center of the card */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[340px] bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between gap-3 border border-neutral-100/80">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-11 h-11 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200/50">
                        <Image
                          src={item.productImg}
                          alt={item.productTitle}
                          fill
                          quality={100}
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.productTitle}
                        </h4>
                        <p className="text-[10px] text-neutral-500 truncate">
                          {item.productSubtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex-shrink-0 bg-[#b98141] hover:bg-[#a57134] active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Title & Description Directly Underneath EACH Card */}
                <div
                  className={`text-center mt-6 px-4 transition-all duration-300 ${
                    isActive ? 'opacity-100 transform-none' : 'opacity-50'
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 whitespace-pre-line leading-relaxed max-w-lg mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Brown Pill Navigation Bar (matching image_6888aa00.png) */}
        <CarouselPillNavigation
          currentIndex={activeIndex}
          totalItems={techItems.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={scrollToCard}
          className="mt-8 sm:mt-12"
        />
      </div>
    </section>
  );
}
