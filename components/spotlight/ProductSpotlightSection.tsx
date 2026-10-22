import Image from 'next/image';
import Link from 'next/link';
import { productSpotlightConfig, type ProductSpotlightConfig } from '@/config/spotlight';

interface ProductSpotlightSectionProps {
  config?: ProductSpotlightConfig;
}

export default function ProductSpotlightSection({
  config = productSpotlightConfig,
}: ProductSpotlightSectionProps) {
  return (
    <section
      aria-label="Product Spotlight"
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden bg-[#2b1f18] select-none"
    >
      {/* Background Image */}
      <Image
        src={config.imageSrc}
        alt={config.imageAlt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1920px"
        className="object-cover object-center select-none"
        quality={100}
        unoptimized={config.imageSrc?.startsWith('data:') || config.imageSrc?.startsWith('http')}
      />

      {/* NEW! Badge in top right corner */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20">
        <span className="inline-block bg-[#b87422] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-[2px] tracking-wide shadow-sm">
          {config.badge}
        </span>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-xl">
          {/* Title */}
          <div className="text-white uppercase tracking-tight font-black leading-[1.05] drop-shadow-md">
            <span className="block text-xl sm:text-2xl lg:text-[28px] font-bold text-white/90 mb-1">
              {config.titlePrefix}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#d79c52] whitespace-pre-line leading-[1.05]">
              {config.titleHighlight}
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-white text-sm sm:text-base lg:text-lg font-normal mt-3 sm:mt-4 leading-snug drop-shadow-xs">
            {config.subtitle}
          </p>

          {/* CTA Button */}
          <div className="mt-6 sm:mt-8">
            <Link
              href={config.ctaHref}
              className="inline-flex items-center justify-center bg-[#b98141] hover:bg-[#a57134] text-white text-sm sm:text-base font-bold px-8 py-3 rounded-full transition-colors duration-200 shadow-xs cursor-pointer"
            >
              {config.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
