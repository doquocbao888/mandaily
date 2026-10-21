import Link from 'next/link';
import { superBannerConfig, type SuperBannerConfig } from '@/config/banner';

interface SuperBannerProps {
  config?: SuperBannerConfig;
}

export default function SuperBanner({ config = superBannerConfig }: SuperBannerProps) {
  return (
    <aside
      aria-label="Announcement"
      className="relative w-full border-b border-black overflow-hidden bg-[#cfb19d]"
      style={{
        backgroundImage: `url("${config.backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Link
        href={config.linkHref}
        className="flex items-center justify-center min-h-[36px] sm:min-h-[39px] px-3 sm:px-4 py-1.5 text-center text-[11px] sm:text-[13px] md:text-[13.5px] leading-snug sm:leading-tight text-neutral-900 font-normal hover:opacity-85 transition-opacity"
      >
        <span className="inline-block tracking-tight sm:tracking-normal max-w-full">
          {config.text}{' '}
          <span className="underline underline-offset-[2.5px] decoration-1 font-medium whitespace-nowrap">
            {config.linkText}
          </span>
        </span>
      </Link>
    </aside>
  );
}
