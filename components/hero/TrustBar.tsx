import Image from 'next/image';
import { trustBarConfig, type TrustBarConfig } from '@/config/trust';

interface TrustBarProps {
  config?: TrustBarConfig;
}

export default function TrustBar({ config = trustBarConfig }: TrustBarProps) {
  return (
    <section
      aria-label="Trust Guarantees"
      className="w-full bg-[#f4f3ed] border-t border-b border-[#e6e6e6] py-5 sm:py-6 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 flex flex-row items-start justify-around sm:justify-center gap-2 sm:gap-12 md:gap-16 lg:gap-24">
        {config.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center gap-2 flex-1 max-w-[110px] sm:max-w-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src={item.iconSrc}
                alt={item.text}
                width={item.iconWidth}
                height={item.iconHeight}
                className="w-auto h-6 sm:h-7 object-contain"
              />
            </div>
            <span className="text-[11.5px] sm:text-[14px] font-medium tracking-tight sm:tracking-normal text-neutral-800 leading-tight">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
