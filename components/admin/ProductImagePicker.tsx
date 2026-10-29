/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ImageIcon, Trash2, Plus, Star, X } from 'lucide-react';

export interface ProductImagePickerProps {
  value?: string;
  onChange?: (url: string) => void;
  mainImage?: string;
  onMainImageChange?: (url: string) => void;
  thumbnailsText?: string;
  onThumbnailsTextChange?: (text: string) => void;
  onOpenMediaPickerForMain?: () => void;
  onOpenMediaPickerForThumb?: () => void;
}

export default function ProductImagePicker({
  value,
  onChange,
  mainImage,
  onMainImageChange,
  thumbnailsText,
  onThumbnailsTextChange,
  onOpenMediaPickerForMain,
  onOpenMediaPickerForThumb,
}: ProductImagePickerProps) {
  const currentMain = mainImage !== undefined ? mainImage : (value || '');
  const handleMainChange = onMainImageChange || onChange || (() => {});

  // Parse thumbnails from text
  const thumbnailList = (thumbnailsText || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const updateThumbnails = (newList: string[]) => {
    if (onThumbnailsTextChange) {
      onThumbnailsTextChange(newList.join('\n'));
    }
  };

  const removeThumbnail = (index: number) => {
    const next = [...thumbnailList];
    next.splice(index, 1);
    updateThumbnails(next);
  };

  const setAsMain = (url: string) => {
    handleMainChange(url);
  };

  const clearMain = () => {
    handleMainChange('');
  };

  if (thumbnailsText !== undefined) {
    return (
      <div className="space-y-4 pt-1">
        {/* Main Image Section - Compact, clean card, zero URLs */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Ảnh đại diện chính (Main Image)
              </span>
              <span className="text-[11px] text-neutral-400">
                • Hiển thị làm ảnh đại diện sản phẩm
              </span>
            </div>
            {currentMain && (
              <button
                type="button"
                onClick={clearMain}
                className="text-[11px] text-neutral-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                title="Gỡ ảnh chính"
              >
                <X className="w-3 h-3" />
                <span>Gỡ ảnh</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Preview Thumbnail */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-white border border-neutral-200 overflow-hidden flex items-center justify-center p-1 shadow-xs flex-shrink-0">
                {currentMain ? (
                  <img
                    src={currentMain}
                    alt="Main product"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <ImageIcon className="w-6 h-6 stroke-1" />
                    <span className="text-[9px] mt-0.5 font-medium">Trống</span>
                  </div>
                )}
              </div>

              {/* Description status */}
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-800">
                  {currentMain ? 'Đã cài đặt ảnh đại diện' : 'Chưa có ảnh đại diện'}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  {currentMain
                    ? 'Ảnh chất lượng cao hiển thị ở trang chủ, giỏ hàng & danh mục'
                    : 'Bấm nút bên phải để chọn ảnh từ thư viện tải lên'}
                </p>
              </div>
            </div>

            {/* Action button */}
            {onOpenMediaPickerForMain && (
              <button
                type="button"
                onClick={onOpenMediaPickerForMain}
                className="flex-shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{currentMain ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Gallery Thumbnails Section - Compact grid, zero URLs */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Ảnh phụ &amp; Thư viện sản phẩm
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-200/80 text-neutral-700">
                {thumbnailList.length} ảnh
              </span>
            </div>

            {onOpenMediaPickerForThumb && (
              <button
                type="button"
                onClick={onOpenMediaPickerForThumb}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ảnh từ thư viện</span>
              </button>
            )}
          </div>

          {/* Grid of preview thumbnails */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
            {thumbnailList.map((url, idx) => {
              const isMain = url === currentMain;
              return (
                <div
                  key={idx}
                  className={`group relative aspect-square bg-white border rounded-xl overflow-hidden p-1 shadow-2xs transition-all flex items-center justify-center ${
                    isMain ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />

                  {/* Order Tag */}
                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1 py-0.2 rounded font-medium pointer-events-none">
                    #{idx + 1}
                  </span>

                  {/* Main indicator */}
                  {isMain && (
                    <span className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded shadow-xs" title="Đang là ảnh chính">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                    {!isMain && (
                      <button
                        type="button"
                        onClick={() => setAsMain(url)}
                        className="w-6 h-6 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                        title="Đặt làm ảnh chính"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeThumbnail(idx)}
                      className="w-6 h-6 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add Button Tile */}
            {onOpenMediaPickerForThumb && (
              <button
                type="button"
                onClick={onOpenMediaPickerForThumb}
                className="aspect-square bg-white hover:bg-amber-50/50 border-2 border-dashed border-neutral-300 hover:border-amber-600 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:text-amber-700 transition cursor-pointer gap-1 p-1 shadow-2xs group"
                title="Bấm để chọn thêm ảnh từ Thư viện Media"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-amber-100 flex items-center justify-center transition">
                  <Plus className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-700" />
                </div>
                <span className="text-[10px] font-bold">Thêm ảnh</span>
              </button>
            )}
          </div>

          {thumbnailList.length === 0 && (
            <p className="text-xs text-neutral-400 italic text-center py-2">
              Chưa có ảnh phụ nào. Bấm &ldquo;Thêm ảnh&rdquo; để bổ sung các góc chụp hoặc hình ảnh minh họa cho sản phẩm.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Fallback single-image preview mode
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
      <div className="w-14 h-14 rounded-lg bg-white border border-neutral-200 overflow-hidden flex items-center justify-center p-1 shadow-xs flex-shrink-0">
        {currentMain ? (
          <img src={currentMain} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        ) : (
          <ImageIcon className="w-5 h-5 text-neutral-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-neutral-800">Ảnh sản phẩm</span>
        <span className="block text-[11px] text-neutral-500 mt-0.5 truncate">
          {currentMain ? 'Đã cài đặt ảnh' : 'Chưa có ảnh'}
        </span>
      </div>
      {onOpenMediaPickerForMain && (
        <button
          type="button"
          onClick={onOpenMediaPickerForMain}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition"
        >
          Chọn ảnh
        </button>
      )}
    </div>
  );
}
