import Image from 'next/image';
import Link from 'next/link';
import { type HeroTileConfig } from '@/config/hero';

interface HeroTileMainProps {
  tile: HeroTileConfig;
}

export default function HeroTileMain({ tile }: HeroTileMainProps) {
  return (
    <div className="relative w-full lg:w-[61.6%] h-[285px] xs:h-[300px] sm:h-[450px] lg:h-[718px] overflow-hidden bg-[#2b1f18] group flex-shrink-0">
      {/* Background Hero Image */}
      <Image
        src={tile.imageSrc}
        alt={tile.imageAlt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="object-cover object-[52%_center] sm:object-right select-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-start pt-3 sm:pt-6 lg:pt-[54px] px-3.5 sm:px-6 lg:px-0">
        <div className="lg:pl-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))] max-w-xl">
          {/* Badge */}
          {tile.badge && (
            <div className="mb-1.5 sm:mb-2.5">
              <span className="inline-block bg-[#b87422] text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-[2px] tracking-wide">
                {tile.badge}
              </span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-white text-[25px] xs:text-[27px] sm:text-3xl lg:text-[40px] xl:text-[42px] font-black uppercase tracking-tight leading-[1.0] sm:leading-[1.05] drop-shadow-md">
            THE LAWN MOWER<sup className="text-[0.55em] font-bold -top-2 sm:-top-3.5 ml-0.5">®</sup> ULTRA <br className="sm:hidden" />GEN 6
          </h1>

          {/* Subheading */}
          {tile.subtitle && (
            <p className="text-white text-xs sm:text-sm lg:text-base font-normal mt-1 sm:mt-2.5 leading-snug drop-shadow-xs">
              {tile.subtitle}
            </p>
          )}

          {/* CTA Button */}
          {tile.ctaText && (
            <div className="mt-3 sm:mt-6">
              <Link
                href={tile.ctaHref}
                className="inline-flex items-center justify-center bg-[#b98141] hover:bg-[#a57134] text-white text-xs sm:text-sm font-bold px-6 sm:px-8 py-2 sm:py-2.5 rounded-full transition-colors duration-200 shadow-xs cursor-pointer"
              >
                {tile.ctaText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
