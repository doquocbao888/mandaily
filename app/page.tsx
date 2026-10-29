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
    quote: 'The Lawn Mower 6.0 chắc chắn là tông đơ đỉnh nhất tôi từng dùng. Không hề kéo rứt lông, cực kỳ êm ái trên vùng da nhạy cảm.'
  },
  {
    id: 'blaiseffrench',
    handle: 'blaiseffrench',
    name: 'Blaise Ffrench',
    compactPoster: '/assets/aistudio/review_blaiseffrench.png',
    largePoster: '/assets/aistudio/review_blaise_large.png',
    videoUrl: 'https://www.youtube.com/shorts/3JZ_D3ELwOQ',
    quote: 'Thiết kế công thái học và pin xuất sắc. Cầm trên tay mang lại cảm giác sang trọng, đẳng cấp phái mạnh.'
  },
  {
    id: 'caleighmackenzie',
    handle: 'caleighmackenzie',
    name: 'Caleigh Mackenzie',
    compactPoster: '/assets/aistudio/review_caleighmackenzie.png',
    largePoster: '/assets/aistudio/review_caleigh_large.png',
    videoUrl: 'https://www.youtube.com/shorts/jfKfPfyJRdk',
    quote: 'Quà tặng hoàn hảo cho chàng! Máy chống nước 100%, chạy siêu êm và cạo rất sạch sẽ.'
  },
  {
    id: 'marcusvance',
    handle: 'marcus_vance',
    name: 'Marcus Vance',
    compactPoster: '/assets/aistudio/30-00006-NA_f201a618.png',
    largePoster: '/assets/aistudio/30-00006-NA_f201a618.png',
    videoUrl: 'https://www.youtube.com/shorts/9bZkp7q19f0',
    quote: 'Bước đột phá thực sự cho việc chăm sóc diện mạo nam giới. Rất đáng tiền!'
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
