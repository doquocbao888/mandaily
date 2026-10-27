/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Star
} from 'lucide-react';

interface ProductImagePickerProps {
  mainImage: string;
  onMainImageChange: (url: string) => void;
  thumbnailsText: string;
  onThumbnailsTextChange: (text: string) => void;
  onOpenMediaPickerForMain: () => void;
  onOpenMediaPickerForThumb: () => void;
}

export default function ProductImagePicker({
  mainImage,
  onMainImageChange,
  thumbnailsText,
  onThumbnailsTextChange,
  onOpenMediaPickerForMain,
  onOpenMediaPickerForThumb,
}: ProductImagePickerProps) {
  const [showAdvancedLinks, setShowAdvancedLinks] = useState(false);

  // Parse thumbnails from multi-line text
  const thumbnailsList = thumbnailsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const handleRemoveThumbnail = (indexToRemove: number) => {
    const updated = thumbnailsList.filter((_, idx) => idx !== indexToRemove);
    onThumbnailsTextChange(updated.join('\n'));
  };

  const handleSetAsMain = (url: string) => {
    onMainImageChange(url);
  };

  const formatUrlPreview = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0]?.replace('data:', '') || 'image';
      const sizeKb = Math.round((url.length * 0.75) / 1024);
      return `[Ảnh Base64 ${mime.toUpperCase()} • ~${sizeKb} KB]`;
    }
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  };

  return (
    <div className="space-y-5 bg-neutral-50/70 p-4 sm:p-5 rounded-2xl border border-neutral-200">
      {/* 1. MAIN IMAGE SECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900 flex items-center space-x-1.5">
            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Ảnh chính đại diện *</span>
            <span className="text-[11px] text-neutral-400 font-normal">
              (Hiển thị trên thẻ sản phẩm & đầu trang)
            </span>
          </label>
          <button
            type="button"
            onClick={onOpenMediaPickerForMain}
            className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center space-x-1.5 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>{mainImage ? 'Đổi ảnh khác' : 'Chọn ảnh chính'}</span>
          </button>
        </div>

        {/* Visual Main Image Preview Box */}
        {mainImage ? (
          <div className="flex items-center space-x-4 p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#f8f8f7] rounded-lg border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img
                src={mainImage}
                alt="Ảnh chính"
                className="w-full h-full object-contain p-1.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-900">Ảnh chính đã chọn</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Đang sử dụng
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono truncate" title={mainImage}>
                {formatUrlPreview(mainImage)}
              </p>
              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenMediaPickerForMain}
                  className="text-xs text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  Thay đổi ảnh
                </button>
                <span className="text-neutral-300">•</span>
                <button
                  type="button"
                  onClick={() => onMainImageChange('')}
                  className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3 inline" />
                  <span>Xóa ảnh</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenMediaPickerForMain}
            className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Chưa có ảnh chính</span>
            <span className="text-[11px] text-amber-700 mt-0.5 font-medium">
              Bấm vào đây để chọn ảnh từ Thư viện Media
            </span>
          </div>
        )}
      </div>

      {/* 2. THUMBNAILS & GALLERY SECTION */}
      <div className="space-y-2.5 pt-2 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900 flex items-center space-x-1.5">
            <span>Bộ sưu tập ảnh phụ ({thumbnailsList.length} ảnh)</span>
            <span className="text-[11px] text-neutral-400 font-normal">
              (Hiển thị trong slider ảnh sản phẩm)
            </span>
          </label>
          <button
            type="button"
            onClick={onOpenMediaPickerForThumb}
            className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center space-x-1 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-700" />
            <span>Thêm ảnh phụ</span>
          </button>
        </div>

        {/* Visual Gallery Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 p-3 bg-white rounded-xl border border-neutral-200 min-h-[105px]">
          {thumbnailsList.map((thumbUrl, idx) => (
            <div
              key={idx}
              className="relative group bg-[#f8f8f7] rounded-lg border border-neutral-200 aspect-square overflow-hidden flex items-center justify-center shadow-2xs hover:border-amber-400 transition-all"
            >
              <img
                src={thumbUrl}
                alt={`Ảnh phụ #${idx + 1}`}
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
              
              {/* Order index badge */}
              <div className="absolute top-1 left-1 bg-neutral-900/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                #{idx + 1}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveThumbnail(idx)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-md p-1 shadow-sm opacity-90 group-hover:opacity-100 transition-all cursor-pointer"
                title="Xóa ảnh này khỏi danh sách"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Set as main image quick action */}
              {thumbUrl !== mainImage && (
                <button
                  type="button"
                  onClick={() => handleSetAsMain(thumbUrl)}
                  className="absolute bottom-1 inset-x-1 bg-neutral-900/85 hover:bg-amber-700 text-white text-[9px] font-bold py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-center cursor-pointer truncate px-1"
                  title="Đặt làm ảnh chính đại diện"
                >
                  Làm ảnh chính
                </button>
              )}
            </div>
          ))}

          {/* "+ Thêm ảnh" Button Card */}
          <button
            type="button"
            onClick={onOpenMediaPickerForThumb}
            className="aspect-square rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/60 transition-all flex flex-col items-center justify-center p-2 text-center cursor-pointer group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-full bg-amber-200/80 group-hover:bg-amber-300/80 flex items-center justify-center text-amber-800 mb-1 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-900 leading-tight">Thêm ảnh</span>
          </button>
        </div>

        {thumbnailsList.length === 0 && (
          <p className="text-[11px] text-neutral-500 italic">
            Chưa có ảnh phụ nào. Bấm nút &ldquo;+ Thêm ảnh phụ&rdquo; ở trên để chọn ảnh từ thư viện.
          </p>
        )}
      </div>

      {/* 3. OPTIONAL ADVANCED: EDIT RAW TEXT (COLLAPSIBLE) */}
      <div className="pt-2 border-t border-neutral-200/80">
        <button
          type="button"
          onClick={() => setShowAdvancedLinks(!showAdvancedLinks)}
          className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center space-x-1 cursor-pointer"
        >
          <span>{showAdvancedLinks ? 'Ẩn cài đặt đường dẫn link thủ công' : 'Tùy chọn nâng cao: Xem / Sửa đường dẫn link thủ công'}</span>
          {showAdvancedLinks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvancedLinks && (
          <div className="mt-2 space-y-3 p-3 bg-white rounded-xl border border-neutral-200 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Link ảnh chính (URL / Base64 Data URI)
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => onMainImageChange(e.target.value)}
                placeholder="/assets/aistudio/... hoặc data:image/..."
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Danh sách link ảnh phụ (Mỗi đường dẫn một dòng)
              </label>
              <textarea
                value={thumbnailsText}
                onChange={(e) => onThumbnailsTextChange(e.target.value)}
                rows={3}
                placeholder="Mỗi link ảnh trên 1 dòng..."
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
