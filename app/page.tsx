import SuperBanner from '@/components/header/SuperBanner';
import Header from '@/components/header/Header';
import HeroSection from '@/components/hero/HeroSection';
import TrustBar from '@/components/hero/TrustBar';
import FeaturedProductsSection from '@/components/products/FeaturedProductsSection';
import CategoryCarouselSection from '@/components/categories/CategoryCarouselSection';
import ProductSpotlightSection from '@/components/spotlight/ProductSpotlightSection';
import GameChangingTechSection from '@/components/spotlight/GameChangingTechSection';
import KOLReviewSection from '@/components/spotlight/KOLReviewSection';

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

        {/* 7. Product Spotlight Section ("THE LAWN MOWER ULTRA GEN 6") */}
        <ProductSpotlightSection />

        {/* 8. Game-Changing Tech Section ("Made for You. Game-changing tech.") */}
        <GameChangingTechSection />

        {/* 9. KOL & KOC Review Videos Section */}
        <KOLReviewSection />
      </main>
    </div>
  );
}

