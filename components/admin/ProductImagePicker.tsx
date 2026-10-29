/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ImageIcon, Trash2, Plus } from 'lucide-react';

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

  if (thumbnailsText !== undefined) {
    return (
      <div className="space-y-6">
        {/* Main Image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Ảnh đại diện chính (Main Image)
          </label>
          <div className="flex items-center justify-between gap-4 bg-neutral-900 border border-neutral-700 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center p-1 shadow-inner">
                {currentMain ? (
                  <img src={currentMain} alt="Main preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-neutral-500" />
                )}
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Ảnh chính sản phẩm</span>
                <span className="block text-xs text-neutral-400 mt-0.5">Hiển thị làm hình đại diện ngoài danh mục &amp; trang chủ</span>
              </div>
            </div>

            {onOpenMediaPickerForMain && (
              <button
                type="button"
                onClick={onOpenMediaPickerForMain}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md flex-shrink-0"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Chọn ảnh từ thư viện</span>
              </button>
            )}
          </div>
        </div>

        {/* Thumbnails (Clean Grid without URL text inputs) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Ảnh phụ &amp; Thư viện sản phẩm ({thumbnailList.length} ảnh)
            </label>
          </div>

          {/* Grid of small image previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {thumbnailList.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-square bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-sm hover:border-amber-500 transition-all"
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removeThumbnail(idx)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>
              </div>
            ))}

            {/* Add button tile */}
            {onOpenMediaPickerForThumb && (
              <button
                type="button"
                onClick={onOpenMediaPickerForThumb}
                className="aspect-square bg-neutral-900 hover:bg-neutral-800 border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center text-neutral-400 hover:text-amber-500 transition-all cursor-pointer gap-1.5 shadow-sm"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold">Thêm ảnh phụ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentMain && (
        <div className="w-16 h-16 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center p-1">
          <img src={currentMain} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
