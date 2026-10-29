/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Upload, ImageIcon } from 'lucide-react';

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

  if (thumbnailsText !== undefined) {
    return (
      <div className="space-y-4">
        {/* Main Image */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Ảnh chính (Main Image URL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMain}
              onChange={(e) => handleMainChange(e.target.value)}
              placeholder="/assets/aistudio/..."
              className="flex-1 bg-[#262626] border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
            {onOpenMediaPickerForMain && (
              <button
                type="button"
                onClick={onOpenMediaPickerForMain}
                className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-amber-500 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Chọn thư viện</span>
              </button>
            )}
          </div>
          {currentMain && (
            <div className="mt-2 w-16 h-16 rounded-lg bg-[#262626] border border-neutral-700 overflow-hidden flex items-center justify-center p-1">
              <img src={currentMain} alt="Main preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Ảnh phụ / Thư viện (Mỗi dòng một URL ảnh)
          </label>
          <div className="flex gap-2 items-start">
            <textarea
              rows={3}
              value={thumbnailsText || ''}
              onChange={(e) => onThumbnailsTextChange && onThumbnailsTextChange(e.target.value)}
              placeholder="/assets/aistudio/image1.png&#10;/assets/aistudio/image2.png"
              className="flex-1 bg-[#262626] border border-neutral-700 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
            {onOpenMediaPickerForThumb && (
              <button
                type="button"
                onClick={onOpenMediaPickerForThumb}
                className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-amber-500 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Thêm từ thư viện</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={currentMain}
        onChange={(e) => handleMainChange(e.target.value)}
        placeholder="Nhập đường dẫn ảnh sản phẩm..."
        className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
      />
      {currentMain && (
        <div className="w-16 h-16 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center p-1">
          <img src={currentMain} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
