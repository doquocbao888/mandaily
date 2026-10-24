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
    badge: 'Just dropped',
    title: 'THE LAWN MOWER® ULTRA GEN 6',
    subtitle: 'Our newest groin and body hair trimmer.',
    ctaText: 'Shop now',
    ctaHref: '/products/the-lawn-mower-ultra-gen-6',
    imageSrc: '/assets/aistudio/lawn-mower-gen6_hero-tile-big_desktop_ad564eb4.jpg',
    imageAlt: 'The Lawn Mower Ultra Gen 6 Trimmer held in hand',
  },
  topRightTile: {
    id: 'deals-kits',
    title: 'Shop deals & kits.',
    ctaHref: '/products?category=deals',
    imageSrc: '/assets/aistudio/the-platinum-package-6_hero-tile-medium_desktop_46f99d0d.jpg',
    imageAlt: 'The Platinum Package 6 groin and grooming kit lineup',
  },
  bottomRightTile: {
    id: 'best-sellers',
    title: 'Shop best sellers.',
    ctaHref: '/products',
    imageSrc: '/assets/aistudio/desktop_tile_8280272404_1de74572.jpg',
    imageAlt: 'The Dome Shaver and best sellers foil razor with light',
  },
};
