import Image from 'next/image';
import Link from 'next/link';
import { type ProductItem } from '@/config/products';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productHref = (!product.href || product.href === '#' || product.href === '') ? `/products/${product.id}` : product.href;

  return (
    <div className="flex flex-col flex-1 bg-transparent group">
      {/* Product Image Card Container */}
      <Link
        href={productHref}
        className="relative w-full aspect-[1/1] sm:aspect-[4/3.8] bg-[#f5f5f5] rounded-[2px] overflow-hidden flex items-center justify-center mb-5 block cursor-pointer transition-transform duration-500 ease-out hover:opacity-98"
      >
        {/* Badges */}
        {product.badge?.toLowerCase().includes('new') && (
          <span className="absolute top-3 left-3 z-10 bg-[#1c2c4c] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider shadow-xs">
            New
          </span>
        )}
        {product.badge?.toLowerCase().includes('sale') && (
          <span className="absolute top-3 right-3 z-10 bg-[#cc1414] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider shadow-xs">
            Sale
          </span>
        )}

        <div className="relative w-full h-full flex items-center justify-center p-3">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={true}
            className="object-contain w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            referrerPolicy="no-referrer"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col space-y-1">
        <Link
          href={productHref}
          className="text-neutral-900 text-base sm:text-lg font-bold tracking-tight hover:underline underline-offset-4"
        >
          {product.title}
        </Link>
        <p className="text-neutral-600 text-xs sm:text-sm font-normal">
          {product.subtitle}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-2 text-sm sm:text-base">
          <span className="text-neutral-900 font-bold text-base sm:text-lg">
            {product.regularPrice || product.vipPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
