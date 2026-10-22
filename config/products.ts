export interface ProductVariant {
  id: string;
  name: string;
  badge?: string;
  price: string;
  originalPrice: string;
  saving?: string;
}

export interface VideoReviewItem {
  id: string;
  handle: string;
  name: string;
  compactPoster: string;
  largePoster: string;
  videoUrl: string;
  quote?: string;
}

export interface ProductItem {
  id: string;
  orderIndex?: number;
  title: string;
  subtitle: string;
  categoryPath: string[];
  vipPrice: string;
  regularPrice: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  thumbnails: string[];
  badge?: string;
  rating: number;
  reviewCount: string;
  soldCount: string;
  salesBadge?: string;
  shortDescription: string;
  highlights: string[];
  reviewSample: {
    author: string;
    rating: number;
    comment: string;
  };
  variants: ProductVariant[];
  gifts: string[];
  cashbackText: string;
  warrantyText: string;
  videoReviews?: VideoReviewItem[];
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
      orderIndex: 0,
      title: 'The Lawn Mower® Ultra Gen 6 - NEW!',
      subtitle: 'Groin & Body Hair Trimmer',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Lawn Mower® Ultra Gen 6'],
      vipPrice: '$109.99',
      regularPrice: '$119.99',
      href: '/products/lawn-mower-ultra-6',
      imageSrc: '/assets/aistudio/30-00006-NA_f201a618.png',
      imageAlt: 'The Lawn Mower Ultra Gen 6 Trimmer with blade attachment',
      thumbnails: [
        '/assets/aistudio/30-00006-NA_f201a618.png',
        '/assets/aistudio/25aaeee852d4_1a4c043f.webp',
        '/assets/aistudio/b72c1da980f6_e399d627.webp',
        '/assets/aistudio/e25de805d015_f449fce7.webp',
        '/assets/aistudio/e38aa911b5e9_8252c23e.webp',
        '/assets/aistudio/fac0fd606c51_4d3a1ba2.webp',
        '/assets/aistudio/685d42568afa_98fc3951.webp',
        '/assets/aistudio/25106398e899_13ff16c1.webp',
      ],
      badge: 'QUÀ TẶNG ĐỘC QUYỀN TRÊN WEBSITE • Dung Dịch Vệ Sinh Nam',
      rating: 5.0,
      reviewCount: '1,671 đánh giá',
      soldCount: 'Đã bán 75.8k',
      salesBadge: 'Best Seller Shopee & TikTok Shop',
      shortDescription: 'Máy cạo lông vùng kín chuyên dụng cao cấp, chống nước IPX7, lưỡi SkinSafe™ bo tròn – an toàn tuyệt đối, không lo trầy xước.',
      highlights: [
        'Sạch chỉ 1 lần lướt',
        'Không đau, không xước (SkinSafe™)',
        'Da mịn, không ngứa rát',
        'Tự tin khi gần gũi'
      ],
      reviewSample: {
        author: 'Chi Hùng',
        rating: 5,
        comment: 'Giao hàng nhanh chóng sản phẩm dễ dùng đi lông khá là sạch mà vẫn khá mượt'
      },
      variants: [
        {
          id: 'lite',
          name: 'TRIMDAY LITE / Ultra Gen 6',
          badge: 'Gọn nhẹ',
          price: '$109.99',
          originalPrice: '$119.99',
          saving: 'Tiết kiệm $10.00'
        },
        {
          id: 'max',
          name: 'The Performance Package Ultra 6',
          badge: 'Đầy đủ',
          price: '$159.99',
          originalPrice: '$179.99',
          saving: 'Tiết kiệm $20.00'
        }
      ],
      gifts: ['Tặng kèm Dung Dịch Vệ Sinh 150ml', 'Tặng kèm Túi Đựng Chống Nước Du Lịch'],
      cashbackText: 'Được hoàn lên đến 56.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    },
    {
      id: 'the-performance-package-ultra-6',
      orderIndex: 1,
      title: 'The Performance Package Ultra Gen 6 - NEW!',
      subtitle: 'Deluxe Full Body Grooming Kit',
      categoryPath: ['Trang chủ', 'PERFORMANCE PACK', 'The Performance Package Ultra Gen 6'],
      vipPrice: '$159.99',
      regularPrice: '$179.99',
      href: '/products/the-performance-package-ultra-6',
      imageSrc: '/assets/aistudio/the-performance-package-6_product_desktop_401c846d.jpg',
      imageAlt: 'The Performance Package Ultra Gen 6 Deluxe Grooming Kit',
      thumbnails: [
        '/assets/aistudio/the-performance-package-6_product_desktop_401c846d.jpg',
        '/assets/aistudio/70-00186_98c22891.png',
        '/assets/aistudio/70-00186_4597ae5e.jpg',
        '/assets/aistudio/image_2826e1f4.png',
        '/assets/aistudio/image_31568bb9.png',
      ],
      badge: 'BỘ KIT TOÀN DIỆN • Giảm giá sốc',
      rating: 4.9,
      reviewCount: '2,480 đánh giá',
      soldCount: 'Đã bán 92.4k',
      salesBadge: 'Top #1 Best Seller Toàn Cầu',
      shortDescription: 'Bộ combo hoàn hảo gồm Máy cạo lông Ultra Gen 6, Crop Preserver lotion chống hăm, Crop Reviver xịt thơm và túi đựng du lịch cao cấp.',
      highlights: [
        'Chăm sóc toàn diện từ đầu tới chân',
        'Công nghệ SkinSafe™ chống cắt xước',
        'Kháng khuẩn & lưu hương nam tính',
        'Tiết kiệm hơn 25% khi mua trọn bộ'
      ],
      reviewSample: {
        author: 'Minh Tuấn',
        rating: 5,
        comment: 'Bộ sản phẩm đỉnh cao, mùi thơm dễ chịu, máy cạo cực kỳ êm ái không bị rát.'
      },
      variants: [
        {
          id: 'standard-kit',
          name: 'The Performance Package Ultra 6',
          badge: 'Gói Chuẩn',
          price: '$159.99',
          originalPrice: '$179.99',
          saving: 'Tiết kiệm $20.00'
        },
        {
          id: 'platinum-kit',
          name: 'The Platinum Package Ultra 6',
          badge: 'Cao Cấp',
          price: '$219.99',
          originalPrice: '$249.99',
          saving: 'Tiết kiệm $30.00'
        }
      ],
      gifts: ['Tặng Crop Preserver 100ml', 'Tặng Hộp Đựng Hạng Sang (Luxe Case)'],
      cashbackText: 'Được hoàn lên đến 85.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    }
  ],
};

export const featuredProductsConfig2: FeaturedProductsConfig = {
  sectionTitle: 'Top-tier essentials.',
  sectionSubtitle: 'OUR RECOS',
  products: [
    ...featuredProductsConfig.products,
    {
      id: 'chairman-pro',
      orderIndex: 2,
      title: 'The Chairman® Pro',
      subtitle: 'Electric Foil Face Shaver',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Chairman® Pro'],
      vipPrice: '$149.99',
      regularPrice: '$159.99',
      href: '/products/chairman-pro',
      imageSrc: '/assets/aistudio/70-00186_4597ae5e.jpg',
      imageAlt: 'The Chairman Pro Shaver',
      thumbnails: [
        '/assets/aistudio/70-00186_4597ae5e.jpg',
        '/assets/aistudio/70-00186_98c22891.png',
        '/assets/aistudio/30-00006-NA_f201a618.png'
      ],
      badge: 'Best Seller',
      rating: 4.8,
      reviewCount: '1,200 đánh giá',
      soldCount: 'Đã bán 50k',
      salesBadge: 'Best Foil Shaver',
      shortDescription: 'Máy cạo râu lá điện tử cao cấp, ôm sát đường viền khuôn mặt, chống rát da.',
      highlights: ['Cạo sát êm ái', 'Chống nicks & cuts', 'Chống nước chuẩn IPX7', 'Pin sạc nhanh Type-C'],
      reviewSample: { author: 'Tuấn Khang', rating: 5, comment: 'Cạo rất sát và êm, không bị rát đỏ.' },
      variants: [
        {
          id: 'chairman-pro-standard',
          name: 'The Chairman® Pro Standard',
          badge: 'Khuyên dùng',
          price: '$149.99',
          originalPrice: '$159.99',
          saving: 'Tiết kiệm $10.00'
        }
      ],
      gifts: ['Tặng Dung Dịch Cạo Râu 100ml', 'Tặng Túi Du Lịch'],
      cashbackText: 'Được hoàn lên đến 75.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    },
    {
      id: 'beard-hedger',
      orderIndex: 3,
      title: 'The Beard Hedger®',
      subtitle: 'Electric Beard Trimmer',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Beard Hedger®'],
      vipPrice: '$89.99',
      regularPrice: '$99.99',
      href: '/products/beard-hedger',
      imageSrc: '/assets/aistudio/image_075587b8.png',
      imageAlt: 'The Beard Hedger Trimmer',
      thumbnails: [
        '/assets/aistudio/image_075587b8.png',
        '/assets/aistudio/25aaeee852d4_1a4c043f.webp',
        '/assets/aistudio/b72c1da980f6_e399d627.webp'
      ],
      badge: 'Best Seller',
      rating: 4.9,
      reviewCount: '2,000 đánh giá',
      soldCount: 'Đã bán 80k',
      salesBadge: 'Top Trimmer',
      shortDescription: 'Máy tỉa râu chuyên dụng với bánh lăn điều chỉnh độ dài 20 mức chính xác.',
      highlights: ['Bánh lăn 20 cự ly', 'Lưỡi titan siêu bén', 'Không kéo giật râu', 'Pin lithium bền bỉ'],
      reviewSample: { author: 'Hoàng Long', rating: 5, comment: 'Máy chạy êm, chỉnh độ dài cực tiện lợi.' },
      variants: [
        {
          id: 'beard-hedger-standard',
          name: 'The Beard Hedger® Standard',
          badge: 'Tiêu chuẩn',
          price: '$89.99',
          originalPrice: '$99.99',
          saving: 'Tiết kiệm $10.00'
        }
      ],
      gifts: ['Tặng Lược Chải Râu Chuyên Dụng'],
      cashbackText: 'Được hoàn lên đến 45.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    },
    {
      id: 'beard-balls-strays',
      orderIndex: 4,
      title: 'The Beard, Balls & Strays Bundle',
      subtitle: 'Three-device bundle with next-gen power.',
      categoryPath: ['Trang chủ', 'BUNDLES', 'The Beard, Balls & Strays Bundle'],
      vipPrice: '$199.99',
      regularPrice: '$209.99',
      href: '/products/beard-balls-strays',
      imageSrc: '/assets/aistudio/the-beard-balls-and-strays-bundle_product_desktop_255fa9af.jpg',
      imageAlt: 'Beard, Balls & Strays Bundle',
      thumbnails: [
        '/assets/aistudio/the-beard-balls-and-strays-bundle_product_desktop_255fa9af.jpg',
        '/assets/aistudio/70-00186_4597ae5e.jpg',
        '/assets/aistudio/30-00006-NA_f201a618.png'
      ],
      badge: 'New',
      rating: 5.0,
      reviewCount: '500 đánh giá',
      soldCount: 'Đã bán 20k',
      salesBadge: 'Combo Tiết Kiệm Nhất',
      shortDescription: 'Bộ 3 thiết bị tối thượng cho râu, cơ thể và vùng nhạy cảm của phái mạnh.',
      highlights: ['Trọn bộ 3 thiết bị cao cấp', 'Tiết kiệm hơn 30% so với mua lẻ', 'Đầy đủ phụ kiện và quà tặng'],
      reviewSample: { author: 'Trần Đạt', rating: 5, comment: 'Mua cả set này quá hời, phụ kiện xịn sò.' },
      variants: [
        {
          id: 'bundle-standard',
          name: 'The Beard, Balls & Strays Complete Set',
          badge: 'Trọn bộ',
          price: '$199.99',
          originalPrice: '$209.99',
          saving: 'Tiết kiệm $35.00'
        }
      ],
      gifts: ['Tặng Túi Đựng Hạng Sang (Luxe Travel Bag)', 'Tặng Khăn Chuyên Dụng'],
      cashbackText: 'Được hoàn lên đến 100.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    }
  ],
};

export function getProductById(id: string): ProductItem | undefined {
  return featuredProductsConfig2.products.find((p) => p.id === id);
}

