export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  vipPrice: string;
  regularPrice: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

export interface FeaturedProductsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  products: ProductItem[];
}

export const featuredProductsConfig: FeaturedProductsConfig = {
  sectionTitle: 'Take it up a crotch.',
  sectionSubtitle: "The greatest invention known to man's balls.",
  products: [
    {
      id: 'lawn-mower-ultra-6',
      title: 'The Lawn Mower® Ultra Gen 6 - NEW!',
      subtitle: 'Groin & Body Hair Trimmer',
      vipPrice: '$109.99',
      regularPrice: '$119.99',
      href: '#',
      imageSrc: '/assets/aistudio/30-00006-NA_f201a618.png',
      imageAlt: 'The Lawn Mower Ultra Gen 6 Trimmer with blade attachment',
    },
    {
      id: 'performance-package-ultra-6',
      title: 'The Performance Package Ultra Gen 6 - NEW!',
      subtitle: 'Deluxe Full Body Grooming Kit',
      vipPrice: '$159.99',
      regularPrice: '$179.99',
      href: '#',
      imageSrc: '/assets/aistudio/70-00186_98c22891.png',
      imageAlt: 'The Performance Package Ultra Gen 6 Deluxe Grooming Kit contents',
    },
  ],
};
