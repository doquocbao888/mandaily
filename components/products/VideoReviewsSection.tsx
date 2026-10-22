'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import type { VideoReviewItem } from '@/config/products';

export type VideoReview = VideoReviewItem;

const REVIEWS: VideoReview[] = [
  {
    id: 'pierredalati',
    handle: 'pierredalati',
    name: 'Pierre Dalati',
    compactPoster: '/assets/aistudio/review_pierre_compact.png',
    largePoster: '/assets/aistudio/review_pierredalati.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    quote: 'The Lawn Mower 6.0 is hands down the best trimmer I have used. Zero tugging, super smooth on sensitive skin.'
  },
  {
    id: 'blaiseffrench',
    handle: 'blaiseffrench',
    name: 'Blaise Ffrench',
    compactPoster: '/assets/aistudio/review_blaiseffrench.png',
    largePoster: '/assets/aistudio/review_blaise_large.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    quote: 'Design, ergonomics, and battery life are unmatched. It feels luxury in your hand.'
  },
  {
    id: 'caleighmackenzie',
    handle: 'caleighmackenzie',
    name: 'Caleigh Mackenzie',
    compactPoster: '/assets/aistudio/review_caleighmackenzie.png',
    largePoster: '/assets/aistudio/review_caleigh_large.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    quote: 'Got this as a gift and we both love it. 100% waterproof and remarkably quiet.'
  }
];

export interface VideoReviewsSectionProps {
  reviews?: VideoReview[];
  title?: string;
  subtitle?: string;
}

export default function VideoReviewsSection({
  reviews: customReviews,
  title = 'The buzz is real.',
  subtitle = 'Tag @manscaped in your review for a chance to be featured.'
}: VideoReviewsSectionProps = {}) {
  const displayReviews = (customReviews && customReviews.length > 0) ? customReviews : REVIEWS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [videoModalReview, setVideoModalReview] = useState<VideoReview | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectVideo = (idx: number) => {
    setActiveIndex(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // When active video changes, reset DOM video element and play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration > 0) {
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full py-16 sm:py-24 bg-white border-t border-neutral-100 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Manscaped reference */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#a6741b] tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-neutral-800 text-sm sm:text-base font-medium">
            {subtitle}
          </p>
        </div>

        {/* Video Cards Row: 3 columns in fixed order, active item expands in place */}
        <div 
          ref={containerRef}
          className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-6 px-2 scrollbar-none"
        >
          {displayReviews.map((review, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div 
                key={review.id} 
                className="flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out"
              >
                {/* Video Card Container */}
                <div
                  onClick={() => {
                    if (!isActive) {
                      selectVideo(idx);
                    } else {
                      togglePlay();
                    }
                  }}
                  className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border transition-all duration-500 ease-in-out cursor-pointer select-none ${
                    isActive
                      ? 'w-[280px] sm:w-[330px] lg:w-[370px] h-[490px] sm:h-[570px] lg:h-[630px] shadow-2xl border-neutral-300 ring-2 ring-black/5 z-10'
                      : 'w-[150px] sm:w-[185px] lg:w-[215px] h-[260px] sm:h-[325px] lg:h-[370px] shadow-md border-neutral-200/90 opacity-90 hover:opacity-100 hover:scale-[1.03]'
                  }`}
                >
                  {/* Active Large Video View */}
                  {isActive ? (
                    <>
                      {/* Top-Right Unmute/Mute Pill Button */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="absolute top-4 right-4 z-20 bg-black/90 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                        aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Unmute</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Mute</span>
                          </>
                        )}
                      </button>

                      {/* Video Element with Poster */}
                      <video
                        ref={videoRef}
                        src={review.videoUrl}
                        poster={review.largePoster}
                        muted={isMuted}
                        loop
                        playsInline
                        autoPlay
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-full object-cover"
                      />

                      {/* Center Play/Pause Indicator on hover/pause */}
                      {!isPlaying && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-15 pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-2xl">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Bottom Control Bar matching screenshot */}
                      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20">
                        <div className="flex items-center space-x-2.5 bg-black/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
                          {/* Play/Pause Button */}
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="text-white hover:text-amber-400 transition flex-shrink-0"
                            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Time Stamp Badge */}
                          <span className="bg-white text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
                            {formatTime(currentTime)}
                          </span>

                          {/* Progress Scrubber Bar */}
                          <div
                            onClick={handleSeek}
                            className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group/bar"
                          >
                            <div
                              className="h-full bg-white rounded-full transition-all duration-100"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          {/* Volume / Fullscreen Button on Right */}
                          <button
                            type="button"
                            onClick={toggleMute}
                            className="text-white/80 hover:text-white transition flex-shrink-0"
                            title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                          >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoModalReview(review);
                            }}
                            className="text-white/80 hover:text-white transition flex-shrink-0"
                            title="Xem lớn"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Inactive Compact Card */
                    <>
                      <Image
                        src={review.compactPoster}
                        alt={review.name}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* White Circular Play Button in Center */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Hover text label */}
                      <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full">
                          Xem video
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Handle underneath each card in its fixed column */}
                <span className={`block text-xs sm:text-sm font-medium transition-colors mt-2.5 text-left ${
                  isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}>
                  @{review.handle}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Video Modal (Optional deep dive) */}
      {videoModalReview && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setVideoModalReview(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] aspect-[9/16] max-h-[85vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
          >
            <button
              onClick={() => setVideoModalReview(null)}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <video
              src={videoModalReview.videoUrl}
              poster={videoModalReview.largePoster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

    </section>
  );
}
