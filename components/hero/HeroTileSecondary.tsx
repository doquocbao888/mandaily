import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { type HeroTileConfig } from '@/config/hero';

interface HeroTileSecondaryProps {
  tile: HeroTileConfig;
  heightClass: string;
}

export default function HeroTileSecondary({
  tile,
  heightClass,
}: HeroTileSecondaryProps) {
  return (
    <Link
      href={tile.ctaHref}
      className={`relative w-full ${heightClass} overflow-hidden block group select-none flex-shrink-0 cursor-pointer`}
      aria-label={tile.title}
    >
      {/* Background Image */}
      <Image
        src={tile.imageSrc}
        alt={tile.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 38vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      />

      {/* Subtle bottom gradient to ensure 100% readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />

      {/* Bottom Title & Arrow */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 lg:p-8 flex items-center justify-between text-white z-10">
        <h2 className="text-[13.5px] sm:text-base lg:text-[19px] font-bold tracking-tight text-white drop-shadow-xs">
          {tile.title}
        </h2>
        <div className="flex items-center justify-center pl-3">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
