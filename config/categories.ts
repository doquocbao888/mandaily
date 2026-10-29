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
  sectionTitle: 'Nâng tầm phong độ phái mạnh\ntừ đầu tới chân.',
  shopAllText: 'Xem tất cả',
  shopAllHref: '/products',
  items: [
    {
      id: 'deals-and-kits',
      title: 'Ưu đãi & Combo',
      ctaText: 'Mua ngay',
      ctaHref: '/products?category=deals',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-deals-and-kits_c0012c87.jpg',
      imageAlt: 'Bộ combo ưu đãi chăm sóc nam giới',
    },
    {
      id: 'groin',
      title: 'Chăm sóc vùng kín',
      ctaText: 'Mua ngay',
      ctaHref: '/products?category=groin',
      imageSrc: '/assets/aistudio/ball-deo_50-50-split_results_af40e53e.jpg',
      imageAlt: 'Sản phẩm chăm sóc vùng kín chuyên sâu',
    },
    {
      id: 'beard-and-face',
      title: 'Cạo râu & Chăm sóc mặt',
      ctaText: 'Mua ngay',
      ctaHref: '/products?category=beard',
      imageSrc: '/assets/aistudio/hydrating-beard-wash_spotlight-gallery-feature_1_mobile_ec6142a7.jpg',
      imageAlt: 'Sản phẩm cạo râu và chăm sóc da mặt',
    },
    {
      id: 'head-and-body',
      title: 'Tóc & Toàn thân',
      ctaText: 'Mua ngay',
      ctaHref: '/products?category=body',
      imageSrc: '/assets/aistudio/homepage-superbowl_category-head-and-body_25ee9350.jpg',
      imageAlt: 'Dụng cụ chăm sóc tóc và toàn thân',
    },
  ],
};
