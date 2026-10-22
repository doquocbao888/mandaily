import Image from 'next/image';
import Link from 'next/link';
import { type ProductItem } from '@/config/products';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col flex-1 bg-transparent group">
      {/* Product Image Card Container */}
      <Link
        href={product.href}
        className="relative w-full aspect-[1/1] sm:aspect-[4/3.8] bg-[#f0eee6] rounded-[2px] overflow-hidden flex items-center justify-center mb-5 block cursor-pointer transition-transform duration-500 ease-out hover:opacity-98"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={100}
            unoptimized={product.imageSrc?.startsWith('data:') || product.imageSrc?.startsWith('http')}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col space-y-1">
        <Link
          href={product.href}
          className="text-neutral-900 text-base sm:text-lg font-bold tracking-tight hover:underline underline-offset-4"
        >
          {product.title}
        </Link>
        <p className="text-neutral-600 text-xs sm:text-sm font-normal">
          {product.subtitle}
        </p>

        {/* Pricing */}
        <div className="flex items-center pt-2 text-sm sm:text-base">
          <div className="flex flex-col">
            <span className="text-[#985a12] font-bold text-sm sm:text-base">
              {product.vipPrice}
            </span>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">
              VIP Member Price
            </span>
          </div>

          <div className="h-7 w-[1px] bg-neutral-300 mx-5" />

          <div className="flex flex-col">
            <span className="text-neutral-900 font-bold text-sm sm:text-base">
              {product.regularPrice}
            </span>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">
              Regular Price
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
