'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { featuredProductsConfig, type FeaturedProductsConfig, type ProductItem } from '@/config/products';
import { subscribeProducts, seedInitialProductsIfNeeded } from '@/lib/dbService';

interface FeaturedProductsSectionProps {
  config?: FeaturedProductsConfig;
}

export default function FeaturedProductsSection({
  config = featuredProductsConfig,
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>(config.products);

  useEffect(() => {
    let isMounted = true;

    // Seed initial products to Firestore if empty
    seedInitialProductsIfNeeded().catch(() => {});

    // Subscribe to real-time product updates from Firestore
    const unsubscribe = subscribeProducts((updatedProducts) => {
      if (isMounted && updatedProducts && updatedProducts.length > 0) {
        setProducts(updatedProducts);
      }
    });

    return () => {
      isMounted = false;
      try {
        unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <section
      aria-label="Featured Products"
      className="w-full bg-[#f8f7f2] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#583927] tracking-tight mb-2">
            {config.sectionTitle}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base font-normal">
            {config.sectionSubtitle}
          </p>
        </div>

        {/* Product Grid (2 columns on desktop, 1 on mobile) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
