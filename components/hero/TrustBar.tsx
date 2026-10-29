import { RotateCcw, Truck, ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    id: 'money-back',
    icon: RotateCcw,
    text: 'Cam kết hoàn tiền',
    sub: 'Đổi trả miễn phí 30 ngày',
  },
  {
    id: 'shipping',
    icon: Truck,
    text: 'Miễn phí giao hàng',
    sub: 'Cho đơn hàng toàn quốc',
  },
  {
    id: 'warranty',
    icon: ShieldCheck,
    text: 'Bảo hành 2 năm',
    sub: '1 đổi 1 chính hãng',
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Cam kết thương hiệu"
      className="w-full bg-[#f4f3ed] border-t border-b border-[#e6e6e6] py-5 sm:py-6 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-row items-center justify-around sm:justify-center gap-4 sm:gap-16 md:gap-24">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col items-center text-center gap-1.5 flex-1 max-w-[160px] sm:max-w-none"
            >
              <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-200/60 text-neutral-800">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              </div>
              <span className="text-[12.5px] sm:text-[14px] font-bold text-neutral-900 leading-tight">
                {item.text}
              </span>
              <span className="text-[10.5px] sm:text-[12px] text-neutral-500 leading-tight hidden xs:block">
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
