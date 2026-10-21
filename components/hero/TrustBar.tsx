import Image from 'next/image';
import { trustBarConfig, type TrustBarConfig } from '@/config/trust';

interface TrustBarProps {
  config?: TrustBarConfig;
}

export default function TrustBar({ config = trustBarConfig }: TrustBarProps) {
  return (
    <section
      aria-label="Trust Guarantees"
      className="w-full bg-[#f4f3ed] border-t border-b border-[#e6e6e6] py-4 sm:py-5 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-center md:justify-around lg:justify-center gap-6 sm:gap-8 md:gap-16 lg:gap-24">
        {config.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3.5 text-[#1a1a1a]"
          >
            <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8">
              <Image
                src={item.iconSrc}
                alt={item.text}
                width={item.iconWidth}
                height={item.iconHeight}
                className="w-auto h-7 object-contain"
              />
            </div>
            <span className="text-[13.5px] sm:text-[14.5px] font-medium tracking-normal text-neutral-800">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
