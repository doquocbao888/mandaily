import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const featureGuarantees = [
  {
    icon: ShieldCheck,
    title: 'Bảo Hành Chính Hãng 2 Năm',
    description: '1 đổi 1 nhanh chóng nếu có lỗi từ nhà sản xuất.',
  },
  {
    icon: Truck,
    title: 'Miễn Phí Giao Hàng Toàn Quốc',
    description: 'Áp dụng cho mọi đơn hàng từ 500.000đ, đóng gói kín đáo.',
  },
  {
    icon: RotateCcw,
    title: 'Cam Kết Hoàn Tiền 30 Ngày',
    description: 'Đổi trả không cần lý do nếu bạn chưa hài lòng.',
  },
];

export default function FeatureHighlights() {
  return (
    <section aria-label="Cam kết chất lượng" className="w-full bg-[#faf9f5] border-t border-b border-[#e9e6dd] py-8 sm:py-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {featureGuarantees.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#f1ebe0] text-[#9a6e22] flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] text-neutral-900 mb-1">{feature.title}</h3>
                <p className="text-xs sm:text-[13px] text-neutral-500 max-w-[280px] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
