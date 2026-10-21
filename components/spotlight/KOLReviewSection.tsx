'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { KOL_REVIEWS_DATA, KOLReviewItem } from '@/config/kolReviews';

export default function KOLReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideoModal, setActiveVideoModal] = useState<KOLReviewItem | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const progress = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
      setScrollProgress(progress);

      const cardWidth = 360 + 20; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex < KOL_REVIEWS_DATA.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 360 + 20;
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, KOL_REVIEWS_DATA.length - 1);
    scrollToIndex(newIndex);
  };

  return (
    <section className="w-full py-12 bg-[#f7f4ee] overflow-hidden relative">
      
      {/* Navigation Arrows for Convenience */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition shadow-xl"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <button 
          onClick={handleNext}
          disabled={currentIndex >= KOL_REVIEWS_DATA.length - 1}
          className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition shadow-xl"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Full-width Scrollable Video Gallery Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 sm:px-8 py-4 focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {KOL_REVIEWS_DATA.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <div 
              key={item.id}
              onClick={() => setActiveVideoModal(item)}
              className={`flex-none w-[320px] sm:w-[380px] md:w-[420px] snap-start group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-500 ${
                isActive ? 'scale-[1.02] ring-2 ring-white/40' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <Image 
                src={item.thumbnail} 
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Subtle Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Bottom-Right Video Action Icons (Mute & Play matching screenshot) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2.5 z-20">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-black/80 transition">
                  <VolumeX className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-black/80 transition">
                  <Play className="w-4 h-4 fill-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Video Preview Column (9:16) */}
            <div className="relative w-full md:w-[380px] aspect-[9/16] bg-black flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image 
                src={activeVideoModal.thumbnail} 
                alt={activeVideoModal.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-2xl animate-pulse">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Modal Details Column */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto bg-neutral-900 text-white">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
                    <Image 
                      src={activeVideoModal.avatar} 
                      alt={activeVideoModal.creatorName} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{activeVideoModal.creatorName}</h3>
                    <p className="text-neutral-400 text-sm">{activeVideoModal.creatorHandle}</p>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30 mb-3">
                  {activeVideoModal.badge} • {activeVideoModal.views}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold mb-4">{activeVideoModal.title}</h2>
                <p className="text-neutral-300 text-base italic bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/50 mb-6">
                  &ldquo;{activeVideoModal.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center gap-4">
                <button 
                  onClick={() => setActiveVideoModal(null)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-center transition shadow-lg"
                >
                  Đóng & Tiếp tục xem
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
