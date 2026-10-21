export interface KOLReviewItem {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  thumbnail: string;
  title: string;
  badge: string;
  views: string;
  videoUrl?: string;
  quote: string;
}

export const KOL_REVIEWS_DATA: KOLReviewItem[] = [
  {
    id: 'kol-1',
    creatorName: 'HAPAS Official',
    creatorHandle: '@hapas.official',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnail: '/assets/aistudio/image_b4e3063e.png',
    title: 'Hộp quà tặng cao cấp - Đẹp xịn từ cái nhìn đầu tiên',
    badge: 'Đẹp xịn ✨',
    views: '128.4K views',
    quote: 'Unboxing bộ quà tặng sang trọng, thiết kế tinh xảo từng đường nét, làm quà tặng người thương thì hết ý!'
  },
  {
    id: 'kol-2',
    creatorName: 'Linh Review Đồ Đẹp',
    creatorHandle: '@linhreview99',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    thumbnail: '/assets/aistudio/homepage-superbowl_spotlight-gallery_1-motors-cover_desktop_cdbcdc42.jpg',
    title: 'Trải nghiệm thời trang & Phụ kiện đỉnh cao',
    badge: 'Trending 🔥',
    views: '95.2K views',
    quote: 'Cầm trên tay thực tế còn ấn tượng hơn ảnh quảng cáo. Chất liệu cao cấp và hoàn thiện cực kỳ tinh tế.'
  },
  {
    id: 'kol-3',
    creatorName: 'Thảo Unboxing',
    creatorHandle: '@thaounboxing',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    thumbnail: '/assets/aistudio/homepage-superbowl_spotlight-gallery_2-skinsafe_desktop_c51e21b6.jpg',
    title: 'Bí quyết chăm sóc bản thân chuẩn chuyên gia',
    badge: 'Best Choice 💎',
    views: '210.8K views',
    quote: 'An toàn tuyệt đối và cực kỳ tiện dụng. Đây chắc chắn là món đồ không thể thiếu trong tủ đồ hàng ngày.'
  },
  {
    id: 'kol-4',
    creatorName: 'Minh Hoàng Tech',
    creatorHandle: '@minhhoang.tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnail: '/assets/aistudio/homepage-superbowl_spotlight-gallery_3-waterproof_desktop_975e5290.jpg',
    title: 'Kiểm tra độ bền & Khả năng chống nước thực tế',
    badge: 'Thực chiến ⚡',
    views: '154.1K views',
    quote: 'Test trực tiếp trong mọi điều kiện, hoạt động hoàn hảo không một lỗi nhỏ. Quá đáng tiền!'
  },
  {
    id: 'kol-5',
    creatorName: 'Ngọc Mai Style',
    creatorHandle: '@ngocmaistyle',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    thumbnail: '/assets/aistudio/image_b4e3063e.png',
    title: 'Phối đồ cực sang chảnh cùng túi xách hot trend',
    badge: 'Must Have 🌟',
    views: '88.3K views',
    quote: 'Mix & match với outfit nào cũng hợp, sang xịn mịn từ form dáng đến màu sắc.'
  }
];
