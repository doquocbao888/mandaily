'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Youtube } from 'lucide-react';
import type { VideoReviewItem } from '@/config/products';

export type VideoReview = VideoReviewItem;

const REVIEWS: VideoReview[] = [
  {
    id: 'pierredalati',
    handle: 'pierredalati',
    name: 'Pierre Dalati',
    compactPoster: '/assets/aistudio/review_pierre_compact.png',
    largePoster: '/assets/aistudio/review_pierredalati.png',
    videoUrl: 'https://www.youtube.com/shorts/9bZkp7q19f0',
    quote: 'The Lawn Mower 6.0 is hands down the best trimmer I have used. Zero tugging, super smooth on sensitive skin.'
  },
  {
    id: 'blaiseffrench',
    handle: 'blaiseffrench',
    name: 'Blaise Ffrench',
    compactPoster: '/assets/aistudio/review_blaiseffrench.png',
    largePoster: '/assets/aistudio/review_blaise_large.png',
    videoUrl: 'https://www.youtube.com/shorts/3JZ_D3ELwOQ',
    quote: 'Design, ergonomics, and battery life are unmatched. It feels luxury in your hand.'
  },
  {
    id: 'caleighmackenzie',
    handle: 'caleighmackenzie',
    name: 'Caleigh Mackenzie',
    compactPoster: '/assets/aistudio/review_caleighmackenzie.png',
    largePoster: '/assets/aistudio/review_caleigh_large.png',
    videoUrl: 'https://www.youtube.com/shorts/jfKfPfyJRdk',
    quote: 'Got this as a gift and we both love it. 100% waterproof and remarkably quiet.'
  }
];

export interface VideoReviewsSectionProps {
  reviews?: VideoReview[];
  title?: string;
  subtitle?: string;
}

export function getYouTubeEmbedUrl(
  url: string, 
  isPlaying = true, 
  isMuted = true, 
  showControls = false
): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/shorts/')) {
    const parts = url.split('/shorts/');
    videoId = parts[1]?.split('?')[0];
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    videoId = parts[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
      videoId = urlObj.searchParams.get('v') || '';
    } catch {
      videoId = '';
    }
  } else if (url.includes('youtube.com/embed/')) {
    const parts = url.split('/embed/');
    videoId = parts[1]?.split('?')[0];
  } else {
    videoId = url;
  }

  if (!videoId) return url;

  // IMPORTANT:
  // To prevent mobile browsers from pausing or reloading when unmuting,
  // we initialize the iframe with autoplay=1&mute=1&enablejsapi=1.
  // Mute/unmute, play/pause, and seeking are controlled dynamically via postMessage.
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: showControls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1'
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
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
  const [showSoundToast, setShowSoundToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(15);
  const [videoModalReview, setVideoModalReview] = useState<VideoReview | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);

  // Send commands to YouTube iframes via postMessage (no iframe reload)
  const sendPlayerCommand = (func: string, args: any = '') => {
    const message = JSON.stringify({
      event: 'command',
      func,
      args
    });

    if (desktopIframeRef.current?.contentWindow) {
      try {
        desktopIframeRef.current.contentWindow.postMessage(message, '*');
      } catch {
        // ignore
      }
    }

    if (mobileIframeRef.current?.contentWindow) {
      try {
        mobileIframeRef.current.contentWindow.postMessage(message, '*');
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.25));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Synchronize unmuted state when switching videos
  useEffect(() => {
    if (!isMuted) {
      const t1 = setTimeout(() => {
        sendPlayerCommand('unMute');
        if (isPlaying) sendPlayerCommand('playVideo');
      }, 500);
      const t2 = setTimeout(() => {
        sendPlayerCommand('unMute');
        if (isPlaying) sendPlayerCommand('playVideo');
      }, 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [activeIndex, isMuted, isPlaying]);

  const selectVideo = (idx: number) => {
    setActiveIndex(idx);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      sendPlayerCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendPlayerCommand('playVideo');
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isMuted) {
      sendPlayerCommand('unMute');
      sendPlayerCommand('playVideo');
      setIsMuted(false);
      setIsPlaying(true);
      setShowSoundToast(true);
      setTimeout(() => setShowSoundToast(false), 2000);
    } else {
      sendPlayerCommand('mute');
      setIsMuted(true);
    }
  };

  // Direct touch or click on the mobile video card automatically un-mutes and plays seamlessly
  const handleMobileCardTap = () => {
    if (isMuted) {
      sendPlayerCommand('unMute');
      sendPlayerCommand('playVideo');
      setIsMuted(false);
      setIsPlaying(true);
      setShowSoundToast(true);
      setTimeout(() => setShowSoundToast(false), 2000);
    } else {
      togglePlay();
    }
  };

  const handleDesktopCardClick = (idx: number, isActive: boolean) => {
    if (!isActive) {
      selectVideo(idx);
    } else {
      if (isMuted) {
        sendPlayerCommand('unMute');
        sendPlayerCommand('playVideo');
        setIsMuted(false);
        setIsPlaying(true);
        setShowSoundToast(true);
        setTimeout(() => setShowSoundToast(false), 2000);
      } else {
        togglePlay();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    setCurrentTime(targetTime);
    sendPlayerCommand('seekTo', [targetTime, true]);
    sendPlayerCommand('playVideo');
    setIsPlaying(true);
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
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#a6741b] tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-neutral-800 text-sm sm:text-base font-medium">
            {subtitle}
          </p>
        </div>

        {/* Desktop View: 3 side-by-side expanding cards (Kept 100% intact) */}
        <div 
          ref={containerRef}
          className="hidden sm:flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-6 px-2 scrollbar-none"
        >
          {displayReviews.map((review, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div 
                key={review.id || idx} 
                className="flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out"
              >
                {/* Video Card Container */}
                <div
                  onClick={() => handleDesktopCardClick(idx, isActive)}
                  className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border transition-all duration-500 ease-in-out cursor-pointer select-none ${
                    isActive
                      ? 'w-[280px] sm:w-[330px] lg:w-[370px] h-[490px] sm:h-[570px] lg:h-[630px] shadow-2xl border-neutral-300 ring-2 ring-black/5 z-10'
                      : 'w-[150px] sm:w-[185px] lg:w-[215px] h-[260px] sm:h-[325px] lg:h-[370px] shadow-md border-neutral-200/90 opacity-90 hover:opacity-100 hover:scale-[1.03]'
                  }`}
                >
                  {/* Active Large Video View (YouTube Embed) */}
                  {isActive ? (
                    <>
                      {/* Top-Right Unmute/Mute Pill Button */}
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="absolute top-4 right-4 z-30 bg-black/90 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
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

                      {/* YouTube Badge */}
                      <div className="absolute top-4 left-4 z-30 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1 shadow">
                        <Youtube className="w-3.5 h-3.5" />
                        <span>Shorts</span>
                      </div>

                      {/* Toast Notification when Sound is Unmuted */}
                      {showSoundToast && (
                        <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none z-30 transition-all duration-300">
                          <div className="bg-amber-500 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 animate-bounce">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Đã bật âm thanh</span>
                          </div>
                        </div>
                      )}

                      {/* YouTube Iframe Embed */}
                      <div className="w-full h-full relative pointer-events-none">
                        <iframe
                          ref={desktopIframeRef}
                          src={getYouTubeEmbedUrl(review.videoUrl, true, false, false)}
                          title={review.name}
                          className="w-full h-full object-cover border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>

                      {/* Bottom Control Bar */}
                      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-30">
                        <div className="flex items-center space-x-2.5 bg-black/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
                          {/* Play/Pause Button: small horizontal rounded rectangle, dark translucent background, white icon */}
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="text-white bg-black/60 hover:bg-black/80 px-2 py-0.5 h-5 min-w-[28px] rounded-[5px] flex items-center justify-center transition flex-shrink-0 border border-white/10"
                            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                          >
                            {isPlaying ? (
                              <Pause className="w-2.5 h-2.5 fill-current text-white" />
                            ) : (
                              <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-white" />
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
                            className="text-white/80 bg-black/50 hover:bg-black/70 p-1 rounded-md transition flex-shrink-0"
                            title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                          >
                            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoModalReview(review);
                            }}
                            className="text-white/80 bg-black/50 hover:bg-black/70 p-1 rounded-md transition flex-shrink-0"
                            title="Xem lớn"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Inactive Compact Card */
                    <>
                      <Image
                        src={review.compactPoster || review.largePoster}
                        alt={review.name}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* YouTube Icon badge on compact card */}
                      <div className="absolute top-2.5 right-2.5 z-10 bg-red-600/90 text-white p-1 rounded-md shadow">
                        <Youtube className="w-3 h-3" />
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

        {/* Mobile View: Single Large Active Video on Top + Thumbnails Row underneath */}
        <div className="sm:hidden flex flex-col items-center w-full max-w-[340px] mx-auto">
          {/* Large Active Video Card (Tapping anywhere un-mutes and plays with sound seamlessly) */}
          <div 
            onClick={handleMobileCardTap}
            className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-300 shadow-xl select-none cursor-pointer group"
          >
            {/* Top-Right Unmute/Mute Pill Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 bg-black/90 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
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

            {/* YouTube Badge */}
            <div className="absolute top-4 left-4 z-30 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1 shadow">
              <Youtube className="w-3.5 h-3.5" />
              <span>Shorts</span>
            </div>

            {/* Center Hint Badge when Muted on Mobile */}
            {isMuted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4">
                <div className="bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center space-x-2 animate-pulse">
                  <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Chạm vào video để bật tiếng &amp; phát</span>
                </div>
              </div>
            )}

            {/* Toast Notification when Sound is Unmuted */}
            {showSoundToast && (
              <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none z-30 transition-all duration-300">
                <div className="bg-amber-500 text-neutral-950 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 animate-bounce">
                  <Volume2 className="w-4 h-4" />
                  <span>Đã bật âm thanh</span>
                </div>
              </div>
            )}

            {/* YouTube Iframe Embed */}
            <div className="w-full h-full relative pointer-events-none">
              <iframe
                ref={mobileIframeRef}
                src={getYouTubeEmbedUrl(displayReviews[activeIndex].videoUrl, true, false, false)}
                title={displayReviews[activeIndex].name}
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Bottom Control Bar */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-30">
              <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
                {/* Play/Pause Button: small horizontal rounded rectangle, dark translucent background, white icon */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-white bg-black/60 hover:bg-black/80 px-2 py-0.5 h-5 min-w-[28px] rounded-[5px] flex items-center justify-center transition flex-shrink-0 border border-white/10"
                  aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                >
                  {isPlaying ? (
                    <Pause className="w-2.5 h-2.5 fill-current text-white" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-white" />
                  )}
                </button>
                <span className="bg-white text-neutral-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
                  {formatTime(currentTime)}
                </span>
                <div
                  onClick={handleSeek}
                  className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div className="h-full bg-white rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-white/80 bg-black/50 hover:bg-black/70 p-1 rounded-md transition flex-shrink-0"
                  title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoModalReview(displayReviews[activeIndex]);
                  }}
                  className="text-white/80 bg-black/50 hover:bg-black/70 p-1 rounded-md transition flex-shrink-0"
                  title="Xem lớn"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Handle underneath */}
          <div className="w-full text-left mt-3">
            <span className="text-sm font-semibold text-neutral-900">
              @{displayReviews[activeIndex].handle}
            </span>
          </div>

          {/* Thumbnails Row underneath */}
          <div className="flex items-center space-x-3 mt-3 w-full justify-start">
            {displayReviews.map((review, idx) => {
              const isSel = idx === activeIndex;
              return (
                <button
                  key={review.id || idx}
                  onClick={() => selectVideo(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 ${
                    isSel
                      ? 'border-amber-600 ring-2 ring-amber-600/30 scale-105 shadow-md'
                      : 'border-neutral-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={review.compactPoster || review.largePoster}
                    alt={review.name}
                    fill
                    sizes="90px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Fullscreen Video Modal */}
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

            <iframe
              src={getYouTubeEmbedUrl(videoModalReview.videoUrl, true, false, true)}
              title={videoModalReview.name}
              className="w-full h-full object-cover border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </section>
  );
}
