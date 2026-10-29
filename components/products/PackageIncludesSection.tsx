/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Package, Sparkles, CheckCircle2, X } from 'lucide-react';
import { type ProductItem } from '@/config/products';

export interface PackageItem {
  id: string;
  name: string;
  subtitle?: string;
  imageSrc: string;
  isGift?: boolean;
  description?: string;
}

interface PackageIncludesSectionProps {
  product: ProductItem;
}

export default function PackageIncludesSection({ product }: PackageIncludesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<PackageItem | null>(null);

  // Construct items list: use product.packageIncludes if available, otherwise build from thumbnails and gifts
  const getItems = (): PackageItem[] => {
    if ((product as any).packageIncludes && Array.isArray((product as any).packageIncludes) && (product as any).packageIncludes.length > 0) {
      return (product as any).packageIncludes;
    }

    const thumbs = (product.thumbnails && product.thumbnails.length > 0)
      ? product.thumbnails
      : [product.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png'];

    const gifts = product.gifts || [];

    const defaultItems: PackageItem[] = [
      {
        id: 'pkg-1',
        name: product.title.replace(' - NEW!', ''),
        subtitle: 'Thân máy chính SkinSafe™',
        imageSrc: thumbs[0] || product.imageSrc,
        isGift: false,
        description: 'Tông đơ cắt tỉa chuyên dụng cao cấp, chống nước 100% IPX7, trang bị lưỡi dao bo tròn an toàn chống trầy xước.'
      },
      {
        id: 'pkg-2',
        name: 'Đế sạc & Cáp USB-C',
        subtitle: 'Sạc nhanh thông minh',
        imageSrc: thumbs[1] || thumbs[0],
        isGift: false,
        description: 'Chân đế sạc không dây cao cấp kết hợp cáp sạc nhanh chuẩn USB-C tiện lợi khi mang theo du lịch.'
      },
      {
        id: 'pkg-3',
        name: 'Lược căn độ dài',
        subtitle: 'Khóa an toàn SkinSafe™',
        imageSrc: thumbs[2] || thumbs[0],
        isGift: false,
        description: 'Bộ cữ định hình đa nấc giúp tùy chỉnh độ dài cắt tỉa linh hoạt từ 1.4mm đến 6mm theo ý muốn.'
      },
      {
        id: 'pkg-4',
        name: 'Chổi & Dầu tra lưỡi',
        subtitle: 'Bộ bảo dưỡng máy',
        imageSrc: thumbs[3] || thumbs[0],
        isGift: false,
        description: 'Dụng cụ vệ sinh loại bỏ vụn lông và dầu bôi trơn chuyên dụng giữ cho lưỡi máy luôn sắc bén và chạy êm ái.'
      }
    ];

    // Add Gifts as items if available
    gifts.forEach((giftName, idx) => {
      const giftImg = thumbs[4 + idx] || thumbs[idx % thumbs.length];
      defaultItems.push({
        id: `gift-${idx}`,
        name: giftName,
        subtitle: 'Quà tặng độc quyền miễn phí',
        imageSrc: giftImg,
        isGift: true,
        description: `Sản phẩm quà tặng chính hãng MANFRESH trị giá cao được tặng kèm hoàn toàn miễn phí khi đặt mua trọn bộ.`
      });
    });

    return defaultItems;
  };

  const items = getItems();

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="mt-5 mb-6 bg-gradient-to-b from-[#fbf9f4] to-[#f4efded9] border border-[#e5dfd3] rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden select-none">
      
      {/* Decorative Gold Header Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c49231] to-transparent" />

      {/* Title Bar with Navigation */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-amber-100/80 text-[#9c6a1b] flex items-center justify-center border border-amber-200">
            <Package className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900 leading-tight">
              TRỌN BỘ PHỤ KIỆN TRONG HỘP ({items.length} món)
            </h3>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Bao gồm đầy đủ thân máy, đế sạc, phụ kiện và quà tặng kèm
            </p>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-[#ded8cb] hover:border-neutral-800 text-neutral-700 hover:text-neutral-900 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-90"
            title="Xem phụ kiện trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-[#ded8cb] hover:border-neutral-800 text-neutral-700 hover:text-neutral-900 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-90"
            title="Xem phụ kiện tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel List */}
      <div
        ref={containerRef}
        className="flex space-x-3 overflow-x-auto py-1 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="w-32 sm:w-40 flex-shrink-0 bg-white border border-[#e8e2d5] hover:border-[#a0681c] rounded-2xl p-2.5 sm:p-3 text-center shadow-2xs transition-all duration-200 hover:shadow-md cursor-pointer group snap-start relative flex flex-col justify-between"
          >
            {/* Badge Top Left */}
            {item.isGift ? (
              <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Quà tặng</span>
              </span>
            ) : (
              <span className="absolute top-2 left-2 z-10 bg-[#f5f1e6] text-[#9c6a1b] font-bold text-[9px] uppercase px-1.5 py-0.5 rounded-md border border-[#e3dac8]">
                Trong hộp
              </span>
            )}

            {/* Thumbnail Box */}
            <div className="relative w-full aspect-square bg-[#f9f8f4] rounded-xl overflow-hidden mb-2 flex items-center justify-center p-2 group-hover:bg-[#f3eee2] transition-colors">
              <img
                src={item.imageSrc}
                alt={item.name}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Item Title & Subtitle */}
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#a0681c] transition-colors">
                {item.name}
              </h4>
              <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Item Quick Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-neutral-200 text-center space-y-4">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-44 h-44 bg-[#f8f7f2] border border-neutral-200 rounded-2xl mx-auto overflow-hidden p-3 flex items-center justify-center">
              <img
                src={selectedItem.imageSrc}
                alt={selectedItem.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#9c6a1b] font-bold text-[10px] uppercase mb-1.5 border border-amber-200/60">
                <CheckCircle2 className="w-3 h-3" />
                <span>{selectedItem.isGift ? 'Quà tặng đi kèm' : 'Đã bao gồm trong hộp'}</span>
              </div>
              <h3 className="text-base font-extrabold text-neutral-900">{selectedItem.name}</h3>
              <p className="text-xs font-semibold text-neutral-500 mt-0.5">{selectedItem.subtitle}</p>
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-left">
                {selectedItem.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
