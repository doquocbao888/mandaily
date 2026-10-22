'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

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
    imageAlt: 'Powerful, Industry-Leading Motors',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'The Lawn Mower® Ultra Gen 6',
    productSubtitle: 'Ultimate Ball & Body Hair Trimmer',
    title: 'Powerful, Industry-Leading Motors',
    description: 'Constant RPMs prevent the blade from slowing down, so your devices are strong until the last stroke.',
  },
  {
    id: 'skinsafe',
    imageSrc: '/assets/aistudio/homepage-superbowl_spotlight-gallery_2-skinsafe_desktop_c51e21b6.jpg',
    imageAlt: 'SkinSafe Blade Technology',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'The Chairman® Pro',
    productSubtitle: 'Electric Foil Face Shaver',
    title: 'SkinSafe® Blade Technology',
    description: 'Designed to give you a skin-close shave while reducing the risks of nicks and snags. So you can shave with confidence.\n*SkinSafe® technology does not guarantee cut protection.',
  },
  {
    id: 'waterproof',
    imageSrc: '/assets/aistudio/homepage-superbowl_spotlight-gallery_3-waterproof_desktop_975e5290.jpg',
    imageAlt: 'Waterproof Design',
    productImg: '/assets/aistudio/lawn-mower-gen6_product_desktop_59f3b73b.jpg',
    productTitle: 'Weed Whacker® 3.0 Pro',
    productSubtitle: 'Electric Nose, Ear & Eyebrow Hair Trimmer',
    title: 'Waterproof Design',
    description: 'Take it in the shower. Trim wet or dry.\n**IPX7 rated to protect against immersion in up to one meter of fresh water for up to 30 minutes.',
  },
];

export default function GameChangingTechSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    const node = itemRefs.current[index];
    if (node && scrollContainerRef.current) {
      node.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handlePrev = () => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : techItems.length - 1;
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeIndex < techItems.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(nextIdx);
  };

  return (
    <section className="relative w-full bg-[#f7f4ee] py-16 lg:py-24 overflow-hidden select-none">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-[#b98141] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2">
            MADE FOR YOU
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight">
            Game-changing tech.
          </h2>
        </div>

        {/* Scrollable Peek Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none scroll-smooth px-[5vw] py-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                className={`snap-center flex-shrink-0 w-[85vw] sm:w-[600px] lg:w-[720px] cursor-pointer transition-all duration-500 ease-out flex flex-col ${
                  isActive ? 'scale-100 opacity-150 z-20' : 'scale-[0.88] opacity-50 hover:opacity-80 z-10'
                }`}
              >
                {/* Image Card */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 600px, 720px"
                    quality={100}
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating Product Pill at Bottom Center of the card */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[320px] bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg flex items-center justify-between gap-3 border border-neutral-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-11 h-11 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
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
                      className="flex-shrink-0 bg-[#b98141] hover:bg-[#a57134] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Title & Description Directly Underneath EACH Card */}
                <div className={`text-center mt-6 px-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
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

        {/* Carousel Navigation Dots & Arrows */}
        <div className="flex items-center justify-center gap-4 mt-12 sm:mt-16">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-[#b98141] hover:bg-[#a57134] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
            aria-label="Previous tech card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {techItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-8 bg-[#b98141]' : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-[#b98141] hover:bg-[#a57134] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
            aria-label="Next tech card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
