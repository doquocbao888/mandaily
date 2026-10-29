import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const trustItems = [
  {
    id: 'warranty',
    icon: ShieldCheck,
    title: 'Bảo Hành Chính Hãng 2 Năm',
    description: '1 đổi 1 nhanh chóng nếu có lỗi từ nhà sản xuất.',
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Miễn Phí Giao Hàng Toàn Quốc',
    description: 'Áp dụng cho mọi đơn hàng từ 500.000đ, đóng gói kín đáo.',
  },
  {
    id: 'money-back',
    icon: RotateCcw,
    title: 'Cam Kết Hoàn Tiền 30 Ngày',
    description: 'Đổi trả không cần lý do nếu bạn chưa hài lòng.',
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Cam kết thương hiệu MANFRESH"
      className="w-full bg-[#faf9f5] border-t border-b border-[#e9e6dd] py-8 sm:py-10 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center text-center px-4"
              >
                {/* Circular Icon with warm beige/sand background */}
                <div className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#f1ebe0] text-[#9a6e22] mb-3 transition-transform hover:scale-105">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                
                {/* Title */}
                <h3 className="text-sm sm:text-[15px] font-bold text-neutral-900 leading-snug mb-1">
                  {item.title}
                </h3>
                
                {/* Subtitle / Description */}
                <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed max-w-[280px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
