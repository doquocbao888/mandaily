export interface CategoryCardItem {
  id: string;
  title: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CategoryCarouselConfig {
  sectionTitle: string;
  shopAllText: string;
  shopAllHref: string;
  items: CategoryCardItem[];
}

export const categoryCarouselConfig: CategoryCarouselConfig = {
  sectionTitle: 'Upgrade your grooming routine\nfrom head to toe.',
  shopAllText: 'Shop all',
  shopAllHref: '#',
  items: [
    {
      id: 'deals-and-kits',
      title: 'Deals & Kits',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-deals-and-kits_c0012c87.jpg',
      imageAlt: 'Deals & Kits grooming sets',
    },
    {
      id: 'groin',
      title: 'Groin',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/ball-deo_50-50-split_results_af40e53e.jpg',
      imageAlt: 'Groin care trimmer and Ball Deo',
    },
    {
      id: 'beard-and-face',
      title: 'Beard & Face Shave',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/hydrating-beard-wash_spotlight-gallery-feature_1_mobile_ec6142a7.jpg',
      imageAlt: 'Beard & Face grooming products',
    },
    {
      id: 'head-and-body',
      title: 'Head & Body',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-head-and-body_25ee9350.jpg',
      imageAlt: 'Head & Body grooming',
    },
    {
      id: 'skincare',
      title: 'Skincare',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-skincare_8561400c.jpg',
      imageAlt: 'Skincare line',
    },
    {
      id: 'apparel-and-accessories',
      title: 'Apparel & Accessories',
      ctaText: 'Shop now',
      ctaHref: '#',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-apparel-and-accessories_4f8cb740.jpg',
      imageAlt: 'Apparel and accessories',
    },
  ],
};
