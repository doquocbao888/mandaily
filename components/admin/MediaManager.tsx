'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Film, 
  Image as ImageIcon, 
  Search, 
  X, 
  FileCheck,
  ExternalLink,
  Plus
} from 'lucide-react';
import { type MediaItem, saveMediaToDb, deleteMediaFromDb } from '@/lib/dbService';

interface MediaManagerProps {
  mediaList: MediaItem[];
  onSelectMedia?: (url: string) => void;
  selectionMode?: boolean;
}

export default function MediaManager({ 
  mediaList, 
  onSelectMedia,
  selectionMode = false 
}: MediaManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCopy = async (url: string) => {
    let copied = false;

    // Method 1: execCommand with temporary textarea - works reliably in sandboxed iframes without permission dialogs
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      copied = document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch {
      copied = false;
    }

    // Method 2: Modern navigator.clipboard as fallback
    if (!copied && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        // Sandboxed iframe write permission denied - already handled
      }
    }

    if (copied) {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 3000);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setLastUploadedUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.media) {
        await saveMediaToDb(data.media);
        setLastUploadedUrl(data.url);
      } else {
        alert(data.error || 'Tải file lên thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi tải file:', err);
      alert('Đã xảy ra lỗi khi tải file lên server.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tệp media này khỏi hệ thống?')) {
      try {
        await deleteMediaFromDb(id);
      } catch (err) {
        console.error('Lỗi khi xóa media:', err);
      }
    }
  };

  const filteredList = mediaList.filter((m) => {
    const matchesFilter = filterType === 'all' || m.mediaType === filterType;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-amber-600/40 bg-gradient-to-b from-amber-50/20 to-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-600/20">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-neutral-900">
                Tải lên hình ảnh hoặc video
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Hỗ trợ PNG, JPG, WEBP, GIF, MP4, WEBM. Đường dẫn (URL) sẽ được tạo tự động và sao chép ngay lập tức.
              </p>
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadFile}
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Chọn tệp tải lên</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Success Alert with Instant Copy URL */}
        {lastUploadedUrl && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Tải lên thành công! Đường dẫn sử dụng:
                </span>
                <code className="text-xs font-mono text-emerald-800 break-all select-all font-semibold">
                  {lastUploadedUrl}
                </code>
              </div>
            </div>

            <button
              onClick={() => handleCopy(lastUploadedUrl)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0 shadow-sm"
            >
              {copiedUrl === lastUploadedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép URL</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tệp media theo tên hoặc URL..."
            className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Tất cả ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
              filterType === 'image' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hình ảnh ({mediaList.filter(m => m.mediaType === 'image').length})</span>
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
              filterType === 'video' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video ({mediaList.filter(m => m.mediaType === 'video').length})</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Visual Thumbnail */}
            <div 
              onClick={() => selectionMode && onSelectMedia ? onSelectMedia(item.url) : setPreviewItem(item)}
              className="relative aspect-square bg-[#f4f3ed] cursor-pointer flex items-center justify-center overflow-hidden"
            >
              {item.mediaType === 'video' ? (
                <div className="flex flex-col items-center justify-center text-neutral-600 p-4 text-center">
                  <Film className="w-10 h-10 mb-2 text-amber-700" />
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-900/80 text-white px-2 py-0.5 rounded">
                    Video
                  </span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="200px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Overlay badges */}
              <div className="absolute top-2 left-2">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow ${
                  item.mediaType === 'video' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-white'
                }`}>
                  {item.mediaType}
                </span>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="p-3 flex flex-col justify-between flex-1 space-y-2 border-t border-neutral-100">
              <div>
                <p className="text-xs font-bold text-neutral-900 truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{item.createdAt?.split(' ')[0]}</span>
                </div>
              </div>

              {/* URL Display with 1-click Copy */}
              <div className="flex items-center bg-neutral-100 rounded-lg p-1.5 border border-neutral-200/80">
                <span className="text-[10px] font-mono text-neutral-600 truncate flex-1 pl-1">
                  {item.url}
                </span>
                <button
                  onClick={() => handleCopy(item.url)}
                  title="Sao chép đường dẫn"
                  className="p-1 hover:bg-white text-neutral-700 rounded transition-colors"
                >
                  {copiedUrl === item.url ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 pt-1">
                {selectionMode && onSelectMedia ? (
                  <button
                    onClick={() => onSelectMedia(item.url)}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-2 rounded-lg text-xs"
                  >
                    Chọn
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa tệp"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
          <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h4 className="font-bold text-neutral-800">Không tìm thấy tệp media nào</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Hãy tải lên hình ảnh hoặc video đầu tiên bằng nút ở trên.
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-900">{previewItem.name}</h3>
                <span className="text-xs text-neutral-500 font-mono">{previewItem.url}</span>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center mb-4">
              {previewItem.mediaType === 'video' ? (
                <video src={previewItem.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <Image
                  src={previewItem.url}
                  alt={previewItem.name}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                Kích thước: {formatFileSize(previewItem.size)}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(previewItem.url)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow"
                >
                  {copiedUrl === previewItem.url ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã sao chép liên kết!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép liên kết (URL)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
