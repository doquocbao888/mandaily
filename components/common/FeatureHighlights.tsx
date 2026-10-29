import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Bảo hành chính hãng 2 năm",
      description: "1 đổi 1 nhanh chóng nếu có lỗi từ nhà sản xuất."
    },
    {
      icon: Truck,
      title: "Miễn phí giao hàng toàn quốc",
      description: "Áp dụng cho mọi đơn hàng từ 500.000đ, đóng gói kín đáo."
    },
    {
      icon: RotateCcw,
      title: "Cam kết hoàn tiền 30 ngày",
      description: "Đổi trả không cần lý do nếu bạn chưa hài lòng."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <Icon className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="font-bold text-lg text-neutral-900">{feature.title}</h3>
            <p className="text-neutral-600 text-sm">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
