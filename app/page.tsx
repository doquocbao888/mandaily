import SuperBanner from '@/components/header/SuperBanner';
import Header from '@/components/header/Header';
import HeroSection from '@/components/hero/HeroSection';
import TrustBar from '@/components/hero/TrustBar';
import FeaturedProductsSection from '@/components/products/FeaturedProductsSection';
import FeaturedProductsCarousel from '@/components/products/FeaturedProductsCarousel';
import CategoryCarouselSection from '@/components/categories/CategoryCarouselSection';
import ProductSpotlightSection from '@/components/spotlight/ProductSpotlightSection';
import GameChangingTechSection from '@/components/spotlight/GameChangingTechSection';
import PressSection from '@/components/spotlight/PressSection';
import Footer from '@/components/header/Footer';
import { featuredProductsConfig2 } from '@/config/products';
import { productSpotlightConfig, productSpotlightConfig2, productSpotlightConfig3 } from '@/config/spotlight';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* 1. Super Banner / Announcement Bar */}
      <SuperBanner />

      {/* 2. Main Header (Brand Bar + Category Navigation) */}
      <Header />

      {/* 3. Hero Section (Mosaic Tiles) */}
      <main className="flex-1 flex flex-col">
        <HeroSection />

        {/* 4. Trust Guarantees Bar */}
        <TrustBar />

        {/* 5. Featured Products Section ("Take it up a crotch.") */}
        <FeaturedProductsSection />

        {/* 6. Category Carousel Section ("Upgrade your grooming routine from head to toe.") */}
        <CategoryCarouselSection />

        {/* 7. Product Spotlight Section 1 */}
        <ProductSpotlightSection config={productSpotlightConfig} />
        
        {/* 7b. Product Spotlight Section 2 */}
        <ProductSpotlightSection config={productSpotlightConfig2} />

        {/* 7c. Product Spotlight Section 3 */}
        <ProductSpotlightSection config={productSpotlightConfig3} />

        {/* 8. Game-Changing Tech Section ("Made for You. Game-changing tech.") */}
        <GameChangingTechSection />

        {/* 9. Press Section */}
        <PressSection />
        
        {/* 10. Featured Products Carousel Section 2 */}
        <FeaturedProductsCarousel config={featuredProductsConfig2} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
