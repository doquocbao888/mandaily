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

export interface PackageItem {
  id: string;
  name: string;
  subtitle?: string;
  imageSrc: string;
  isGift?: boolean;
  description?: string;
}

export interface ProductItem {
  id: string;
  orderIndex?: number;
  title: string;
  subtitle: string;
  category?: string;
  categories?: string[];
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
  detailedDescription?: string;
  videoReviews?: VideoReviewItem[];
  packageIncludes?: PackageItem[];
}

export interface FeaturedProductsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  products: ProductItem[];
}

export const featuredProductsConfig: FeaturedProductsConfig = {
  sectionTitle: 'Bứt phá phong độ.',
  sectionSubtitle: 'Đỉnh cao công nghệ chăm sóc toàn diện dành riêng cho phái mạnh.',
  products: [
    {
      id: 'prod-1793077647995',
      orderIndex: 0,
      title: 'Gen 6',
      subtitle: 'Tông đơ cắt tỉa lông vùng kín & toàn thân',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'Gen 6'],
      vipPrice: '500.000đ',
      regularPrice: '545.500đ',
      href: '/products/prod-1793077647995',
      imageSrc: '/assets/aistudio/image_0fa308a5.png',
      imageAlt: 'Tông đơ MANFRESH Gen 6',
      thumbnails: [
        '/assets/aistudio/image_0fa308a5.png',
        '/assets/aistudio/30-00006-NA_f201a618.png',
      ],
      badge: '',
      rating: 5.0,
      reviewCount: '1,671 đánh giá',
      soldCount: 'Đã bán 75.8k',
      salesBadge: 'Best Seller',
      shortDescription: 'Máy cạo lông vùng kín chuyên dụng cao cấp, chống nước IPX7, lưỡi SkinSafe™ an toàn tuyệt đối.',
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
      variants: [],
      gifts: ['Tặng kèm Dung Dịch Vệ Sinh 150ml'],
      cashbackText: 'Được hoàn lên đến 50.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1',
      detailedDescription: `Tất cả những gì bạn cần để chăm sóc cơ thể gọn gàng, sạch sẽ và tự tin tuyệt đối.`
    },
    {
      id: 'the-platinum-package-ultra-gen-6',
      orderIndex: 0,
      title: 'The Platinum Package Ultra Gen 6',
      subtitle: 'Gói chăm sóc toàn thân xa xỉ',
      categoryPath: ['Trang chủ', 'ƯU ĐÃI & COMBO', 'The Platinum Package Ultra Gen 6'],
      vipPrice: '1.890.000đ',
      regularPrice: '1.990.000đ',
      href: '/products/the-platinum-package-ultra-gen-6',
      imageSrc: '/assets/aistudio/kit_platinum_package_ultra_gen_6.png',
      imageAlt: 'Bộ combo chăm sóc cao cấp The Platinum Package Ultra Gen 6',
      thumbnails: [
        '/assets/aistudio/kit_platinum_package_ultra_gen_6.png',
        '/assets/aistudio/the-platinum-package-6_hero-tile-medium_desktop_46f99d0d.jpg'
      ],
      badge: 'New',
      rating: 5.0,
      reviewCount: '2,640 đánh giá',
      soldCount: 'Đã bán 82k',
      salesBadge: 'Top Tier Luxury Kit',
      shortDescription: 'Gói chăm sóc toàn thân xa xỉ nhất từ MANFRESH, hoàn thiện vẻ lịch lãm của phái mạnh.',
      highlights: ['Tông đơ Ultra Gen 6 thế hệ mới', 'Bộ khử mùi & dưỡng da chuyên sâu', 'Túi da The Shed 2.0 kèm theo'],
      reviewSample: { author: 'Đăng Khoa', rating: 5, comment: 'Đầy đủ mọi thứ cần cho nam giới, rất cao cấp.' },
      variants: [],
      gifts: ['Tặng túi The Shed 2.0', 'Tặng Crop Preserver'],
      cashbackText: 'Hoàn 95.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM'
    },
    {
      id: 'the-performance-package-ultra-6',
      orderIndex: 1,
      title: 'The Performance Package Ultra Gen 6',
      subtitle: 'Bộ combo chăm sóc cao cấp toàn diện',
      categoryPath: ['Trang chủ', 'ƯU ĐÃI & COMBO', 'The Performance Package Ultra Gen 6'],
      vipPrice: '650.000đ',
      regularPrice: '750.000đ',
      href: '/products/the-performance-package-ultra-6',
      imageSrc: '/assets/aistudio/kit_performance_package_ultra_gen_6.png',
      imageAlt: 'The Performance Package Ultra Gen 6',
      thumbnails: [
        '/assets/aistudio/kit_performance_package_ultra_gen_6.png',
        '/assets/aistudio/the-performance-package-6_product_desktop_401c846d.jpg',
      ],
      badge: 'New',
      rating: 4.9,
      reviewCount: '3,820 đánh giá',
      soldCount: 'Đã bán 95k',
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
          price: '650.000đ',
          originalPrice: '750.000đ',
          saving: 'Tiết kiệm 100.000đ'
        },
        {
          id: 'platinum-kit',
          name: 'The Platinum Package Ultra 6',
          badge: 'Cao Cấp',
          price: '2.190.000đ',
          originalPrice: '2.490.000đ',
          saving: 'Tiết kiệm 150.000đ'
        }
      ],
      gifts: ['Tặng Crop Preserver 100ml', 'Tặng Hộp Đựng Hạng Sang (Luxe Case)'],
      cashbackText: 'Được hoàn lên đến 85.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1'
    }
  ],
};

export const featuredProductsConfig2: FeaturedProductsConfig = {
  sectionTitle: 'Sản phẩm thiết yếu hàng đầu',
  sectionSubtitle: 'Gợi ý chọn lọc những sản phẩm chăm sóc bán chạy nhất từ MANFRESH.',
  products: [
    ...featuredProductsConfig.products,
    {
      id: 'the-perfect-package-ultra-gen-6',
      orderIndex: 2,
      title: 'The Perfect Package Ultra Gen 6',
      subtitle: 'Ball and Body Hair Kit',
      categoryPath: ['Trang chủ', 'DEALS & KITS', 'The Perfect Package Ultra Gen 6'],
      vipPrice: '1.390.000đ',
      regularPrice: '1.490.000đ',
      href: '/products/the-perfect-package-ultra-gen-6',
      imageSrc: '/assets/aistudio/kit_perfect_package_ultra_gen_6.png',
      imageAlt: 'The Perfect Package Ultra Gen 6 Ball and Body Hair Kit',
      thumbnails: [
        '/assets/aistudio/kit_perfect_package_ultra_gen_6.png'
      ],
      badge: 'New',
      rating: 4.9,
      reviewCount: '1,890 đánh giá',
      soldCount: 'Đã bán 45k',
      salesBadge: 'Best Value Kit',
      shortDescription: 'Gói chăm sóc chuẩn mực kết hợp máy cạo lông và dưỡng ẩm chống hăm.',
      highlights: ['Công nghệ SkinSafe™', 'Dưỡng chất Crop Preserver', 'Chống nước IPX7'],
      reviewSample: { author: 'Bảo Long', rating: 5, comment: 'Dùng rất hài lòng, máy cạo êm ái nhẹ nhàng.' },
      variants: [],
      gifts: ['Tặng Dung dịch vệ sinh'],
      cashbackText: 'Hoàn 70.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM'
    },
    {
      id: 'ultra-smooth-package',
      orderIndex: 3,
      title: 'Ultra Smooth Package',
      subtitle: '3-Step Ball Shaving Routine',
      categoryPath: ['Trang chủ', 'DEALS & KITS', 'Ultra Smooth Package'],
      vipPrice: '450.000đ',
      regularPrice: '500.000đ',
      href: '/products/ultra-smooth-package',
      imageSrc: '/assets/aistudio/kit_ultra_smooth_package.png',
      imageAlt: 'Ultra Smooth Package 3-Step Ball Shaving Routine',
      thumbnails: [
        '/assets/aistudio/kit_ultra_smooth_package.png'
      ],
      badge: '',
      rating: 4.8,
      reviewCount: '970 đánh giá',
      soldCount: 'Đã bán 30k',
      salesBadge: 'Chăm sóc 3 bước chuyên sâu',
      shortDescription: 'Quy trình 3 bước làm sạch, cạo mượt và khử mùi chuyên biệt cho vùng nhạy cảm.',
      highlights: ['Tẩy tế bào chết Crop Exfoliator', 'Gel cạo Crop Gel', 'Dao cạo The Crop Shaver'],
      reviewSample: { author: 'Quang Anh', rating: 5, comment: 'Bộ 3 bước rất tiện lợi, da mịn màng sạch sẽ.' },
      variants: [],
      gifts: [],
      cashbackText: 'Hoàn 25.000 SpotCredit',
      warrantyText: 'CAM KẾT CHÍNH HÃNG 100%'
    },
    {
      id: 'chairman-pro',
      orderIndex: 2,
      title: 'The Chairman® Pro',
      subtitle: 'Electric Foil Face Shaver',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Chairman® Pro'],
      vipPrice: '1.490.000đ',
      regularPrice: '650.000đ',
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
          price: '1.490.000đ',
          originalPrice: '650.000đ',
          saving: 'Tiết kiệm 50.000đ'
        }
      ],
      gifts: ['Tặng Dung Dịch Cạo Râu 100ml', 'Tặng Túi Du Lịch'],
      cashbackText: 'Được hoàn lên đến 75.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1'
    },
    {
      id: 'beard-hedger',
      orderIndex: 3,
      title: 'The Beard Hedger®',
      subtitle: 'Electric Beard Trimmer',
      categoryPath: ['Trang chủ', 'TRIMDAY™ SERIES', 'The Beard Hedger®'],
      vipPrice: '890.000đ',
      regularPrice: '990.000đ',
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
          price: '890.000đ',
          originalPrice: '990.000đ',
          saving: 'Tiết kiệm 50.000đ'
        }
      ],
      gifts: ['Tặng Lược Chải Râu Chuyên Dụng'],
      cashbackText: 'Được hoàn lên đến 45.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1'
    },
    {
      id: 'beard-balls-strays',
      orderIndex: 4,
      title: 'The Beard, Balls & Strays Bundle',
      subtitle: 'Bộ 3 thiết bị chuyên dụng chăm sóc râu và toàn thân công suất cao.',
      categoryPath: ['Trang chủ', 'COMBO ƯU ĐÃI', 'The Beard, Balls & Strays Bundle'],
      vipPrice: '1.990.000đ',
      regularPrice: '2.090.000đ',
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
          price: '1.990.000đ',
          originalPrice: '2.090.000đ',
          saving: 'Tiết kiệm 150.000đ'
        }
      ],
      gifts: ['Tặng Túi Đựng Hạng Sang (Luxe Travel Bag)', 'Tặng Khăn Chuyên Dụng'],
      cashbackText: 'Được hoàn lên đến 100.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1'
    },
    {
      id: 'ball-scrub',
      orderIndex: 5,
      title: 'Ball Scrub',
      subtitle: 'Gentle Groin Cleanser & Exfoliator',
      categoryPath: ['Trang chủ', 'FORMULATIONS', 'Ball Scrub'],
      vipPrice: '120.000đ',
      regularPrice: '150.000đ',
      href: '/products/ball-scrub',
      imageSrc: '/assets/aistudio/product_ball_scrub.png',
      imageAlt: 'Ball Scrub Gentle Groin Cleanser',
      thumbnails: [
        '/assets/aistudio/product_ball_scrub.png'
      ],
      badge: 'New',
      rating: 4.9,
      reviewCount: '890 đánh giá',
      soldCount: 'Đã bán 35k',
      salesBadge: 'Chăm sóc chuyên sâu',
      shortDescription: 'Tẩy tế bào chết và làm sạch dịu nhẹ vùng nhạy cảm của phái mạnh.',
      highlights: ['Làm sạch dịu nhẹ', 'Chiết xuất tự nhiên', 'Khử mùi hiệu quả'],
      reviewSample: { author: 'Minh Đức', rating: 5, comment: 'Dùng rất thích, da mịn màng thơm tho.' },
      variants: [],
      gifts: [],
      cashbackText: 'Được hoàn lên đến 15.000 SpotCredit',
      warrantyText: 'CAM KẾT CHÍNH HÃNG 100%'
    },
    {
      id: 'the-shed-2',
      orderIndex: 6,
      title: 'The Shed 2.0',
      subtitle: 'Toiletry Bag',
      categoryPath: ['Trang chủ', 'ACCESSORIES', 'The Shed 2.0'],
      vipPrice: '350.000đ',
      regularPrice: '400.000đ',
      href: '/products/the-shed-2',
      imageSrc: '/assets/aistudio/product_the_shed_2.png',
      imageAlt: 'The Shed 2.0 Toiletry Bag',
      thumbnails: [
        '/assets/aistudio/product_the_shed_2.png'
      ],
      rating: 4.8,
      reviewCount: '620 đánh giá',
      soldCount: 'Đã bán 18k',
      salesBadge: 'Phụ kiện cao cấp',
      shortDescription: 'Túi đựng đồ cá nhân nam kháng nước, thiết kế vân sang trọng.',
      highlights: ['Chất liệu kháng nước cao cấp', 'Nhiều ngăn tiện lợi', 'Khoá kéo chống rỉ'],
      reviewSample: { author: 'Huy Hoàng', rating: 5, comment: 'Túi cầm rất chắc tay và đẹp.' },
      variants: [],
      gifts: [],
      cashbackText: 'Được hoàn lên đến 30.000 SpotCredit',
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM'
    },
    {
      id: 'boxers-2',
      orderIndex: 7,
      title: 'MANFRESH® Boxers 2.0',
      subtitle: 'Premium Ultra Soft Boxer Briefs',
      categoryPath: ['Trang chủ', 'APPAREL', 'MANFRESH® Boxers 2.0'],
      vipPrice: '260.000đ',
      regularPrice: '350.000đ',
      href: '/products/boxers-2',
      imageSrc: '/assets/aistudio/product_boxers_2.png',
      imageAlt: 'MANFRESH Boxers 2.0',
      thumbnails: [
        '/assets/aistudio/product_boxers_2.png'
      ],
      rating: 5.0,
      reviewCount: '1,450 đánh giá',
      soldCount: 'Đã bán 60k',
      salesBadge: 'Chống cọ xát',
      shortDescription: 'Quần lót nam lụa modal cao cấp, co giãn 4 chiều, chống cọ xát và thoáng khí tối đa.',
      highlights: ['Chất liệu Modal siêu mềm', 'Đai lưng vàng sang trọng', 'Chống cuộn ống'],
      reviewSample: { author: 'Quang Tuấn', rating: 5, comment: 'Mặc cực kỳ thoải mái, không hề bị bí bách.' },
      variants: [],
      gifts: [],
      cashbackText: 'Được hoàn lên đến 25.000 SpotCredit',
      warrantyText: 'ĐỔI TRẢ TRONG 7 NGÀY'
    },
    {
      id: 'the-shears-3',
      orderIndex: 8,
      title: 'The Shears 3.0',
      subtitle: 'Bộ dụng cụ chăm sóc móng 5 món cao cấp cho nam',
      categoryPath: ['Trang chủ', 'DỤNG CỤ', 'The Shears 3.0'],
      vipPrice: '200.000đ',
      regularPrice: '250.000đ',
      href: '/products/the-shears-3',
      imageSrc: '/assets/aistudio/product_the_shears_3.png',
      imageAlt: 'Bộ bấm móng cao cấp The Shears 3.0',
      thumbnails: [
        '/assets/aistudio/product_the_shears_3.png'
      ],
      rating: 4.9,
      reviewCount: '780 đánh giá',
      soldCount: 'Đã bán 28k',
      salesBadge: 'Bộ dụng cụ làm móng',
      shortDescription: 'Bộ chăm sóc móng tay móng chân 5 món thép không gỉ cao cấp trong bao da từ tính.',
      highlights: ['Thép không gỉ sắc bén', 'Bao da sang trọng', 'Đầy đủ 5 món chuyên dụng'],
      reviewSample: { author: 'Thành Nam', rating: 5, comment: 'Bấm rất bén và gọn gàng, bao đựng đẹp.' },
      variants: [],
      gifts: [],
      cashbackText: 'Được hoàn lên đến 20.000 SpotCredit',
      warrantyText: 'BẢO HÀNH TRỌN ĐỜI'
    }
  ],
};

export function getProductById(id: string): ProductItem | undefined {
  if (!id) return undefined;
  const cleanId = decodeURIComponent(id).trim().toLowerCase();
  return featuredProductsConfig2.products.find((p) => {
    const pId = p.id.toLowerCase();
    const pHrefSlug = (p.href || '').toLowerCase().replace(/^\/products\//, '').replace(/^\//, '');
    return (
      pId === cleanId ||
      pHrefSlug === cleanId ||
      p.href?.toLowerCase() === `/products/${cleanId}` ||
      p.href?.toLowerCase() === cleanId
    );
  });
}

