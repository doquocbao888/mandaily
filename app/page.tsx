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
import VideoReviewsSection from '@/components/products/VideoReviewsSection';
import Footer from '@/components/header/Footer';
import { featuredProductsConfig2 } from '@/config/products';
import { productSpotlightConfig, productSpotlightConfig2, productSpotlightConfig3 } from '@/config/spotlight';

const homeVideoReviews = [
  {
    id: 'pierredalati',
    handle: 'pierredalati',
    name: 'Pierre Dalati',
    compactPoster: '/assets/aistudio/review_pierre_compact.png',
    largePoster: '/assets/aistudio/review_pierredalati.png',
    videoUrl: 'https://www.youtube.com/shorts/9bZkp7q19f0',
    quote: 'The Lawn Mower 6.0 is hands down the best trimmer I have used. Zero tugging, super smooth on sensitive skin.'
  },
  {
    id: 'blaiseffrench',
    handle: 'blaiseffrench',
    name: 'Blaise Ffrench',
    compactPoster: '/assets/aistudio/review_blaiseffrench.png',
    largePoster: '/assets/aistudio/review_blaise_large.png',
    videoUrl: 'https://www.youtube.com/shorts/3JZ_D3ELwOQ',
    quote: 'Design, ergonomics, and battery life are unmatched. It feels luxury in your hand.'
  },
  {
    id: 'caleighmackenzie',
    handle: 'caleighmackenzie',
    name: 'Caleigh Mackenzie',
    compactPoster: '/assets/aistudio/review_caleighmackenzie.png',
    largePoster: '/assets/aistudio/review_caleigh_large.png',
    videoUrl: 'https://www.youtube.com/shorts/jfKfPfyJRdk',
    quote: 'Got this as a gift and we both love it. 100% waterproof and remarkably quiet.'
  },
  {
    id: 'marcusvance',
    handle: 'marcus_vance',
    name: 'Marcus Vance',
    compactPoster: '/assets/aistudio/30-00006-NA_f201a618.png',
    largePoster: '/assets/aistudio/30-00006-NA_f201a618.png',
    videoUrl: 'https://www.youtube.com/shorts/9bZkp7q19f0',
    quote: 'Absolute game changer for grooming. Worth every penny.'
  }
];

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

        {/* 11. Video Reviews Section (4 videos on Homepage) */}
        <VideoReviewsSection reviews={homeVideoReviews} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
