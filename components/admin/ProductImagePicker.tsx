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
      <div className="space-y-8">
        {/* Main Image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Ảnh đại diện chính
          </label>
          <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 rounded-xl p-3">
            <div className="w-16 h-16 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center p-1">
              {currentMain ? (
                <img src={currentMain} alt="Main preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <ImageIcon className="w-6 h-6 text-neutral-600" />
              )}
            </div>
            <div className="flex-grow">
              <span className="block text-sm font-semibold text-white">Hình đại diện sản phẩm</span>
              <span className="block text-xs text-neutral-500 mt-0.5">Xuất hiện trên danh mục & trang chủ</span>
            </div>
            {onOpenMediaPickerForMain && (
              <button
                type="button"
                onClick={onOpenMediaPickerForMain}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Thay đổi
              </button>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
              Ảnh phụ & Thư viện ({thumbnailList.length})
            </label>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {thumbnailList.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-square bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-sm hover:border-neutral-600 transition-all"
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removeThumbnail(idx)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}

            {onOpenMediaPickerForThumb && (
              <button
                type="button"
                onClick={onOpenMediaPickerForThumb}
                className="aspect-square bg-neutral-900 border border-dashed border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-all gap-1"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px] font-semibold">Thêm</span>
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
