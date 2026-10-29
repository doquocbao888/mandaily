export interface HeroTileConfig {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
}

export interface HeroConfig {
  mainTile: HeroTileConfig;
  topRightTile: HeroTileConfig;
  bottomRightTile: HeroTileConfig;
}

export const heroConfig: HeroConfig = {
  mainTile: {
    id: 'lawn-mower-gen6',
    badge: 'Mới ra mắt',
    title: 'THE LAWN MOWER® ULTRA GEN 6',
    subtitle: 'Tông đơ cắt tỉa lông vùng kín và toàn thân thế hệ mới nhất.',
    ctaText: 'Mua ngay',
    ctaHref: '/products/the-lawn-mower-ultra-gen-6',
    imageSrc: '/assets/aistudio/lawn-mower-gen6_hero-tile-big_desktop_ad564eb4.jpg',
    imageAlt: 'Tông đơ MANFRESH Lawn Mower Ultra Gen 6 trên tay',
  },
  topRightTile: {
    id: 'deals-kits',
    title: 'Xem ưu đãi & combo',
    ctaHref: '/products?category=deals',
    imageSrc: '/assets/aistudio/the-platinum-package-6_hero-tile-medium_desktop_46f99d0d.jpg',
    imageAlt: 'Bộ combo chăm sóc cao cấp The Platinum Package 6',
  },
  bottomRightTile: {
    id: 'best-sellers',
    title: 'Sản phẩm bán chạy nhất',
    ctaHref: '/products',
    imageSrc: '/assets/aistudio/desktop_tile_8280272404_1de74572.jpg',
    imageAlt: 'Máy cạo The Dome Shaver và các sản phẩm bán chạy nhất',
  },
};
