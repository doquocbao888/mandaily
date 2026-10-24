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
  Plus,
  Link as LinkIcon
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
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [mediaToast, setMediaToast] = useState<{ text: string; isError?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, isError = false) => {
    setMediaToast({ text, isError });
    setTimeout(() => {
      setMediaToast(null);
    }, 3500);
  };

  const handleAddCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = customUrl.trim();
    if (!url) return;

    const isVideo = url.match(/\.(mp4|webm|mov|mkv)($|\?)/i) !== null;
    const timestamp = Date.now();
    const media: MediaItem = {
      id: `media-${timestamp}`,
      name: customName.trim() || url.split('/').pop()?.split('?')[0] || `Media ${timestamp}`,
      url: url,
      type: isVideo ? 'video/mp4' : 'image/jpeg',
      mediaType: isVideo ? 'video' : 'image',
      size: 0,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    try {
      await saveMediaToDb(media);
      setLastUploadedUrl(url);
      setCustomUrl('');
      setCustomName('');
      setShowAddUrlModal(false);
      showToast('Đã thêm tệp media vào hệ thống thành công!');
    } catch (err: any) {
      console.error('Lỗi khi lưu media:', err);
      showToast(err?.message || 'Không thể lưu media vào hệ thống.', true);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDisplayUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0]?.replace('data:', '') || 'image';
      const sizeKb = Math.round((url.length * 0.75) / 1024);
      return `data:${mime};base64,... (${sizeKb} KB)`;
    }
    if (url.length > 50) {
      return url.substring(0, 47) + '...';
    }
    return url;
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
        showToast('Đã tải lên tệp media thành công!');
      } else {
        showToast(data.error || 'Tải file lên thất bại.', true);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải file:', err);
      showToast(err?.message || 'Đã xảy ra lỗi khi tải file lên server.', true);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const executeDeleteMedia = async () => {
    if (!mediaToDelete) return;
    setIsDeletingMedia(true);
    try {
      await deleteMediaFromDb(mediaToDelete.id);
      showToast('Đã xóa tệp media thành công!');
      setMediaToDelete(null);
    } catch (err: any) {
      console.error('Lỗi khi xóa media:', err);
      showToast(err?.message || 'Không thể xóa tệp media.', true);
    } finally {
      setIsDeletingMedia(false);
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

          <div className="flex items-center space-x-2.5">
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
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tải tệp từ máy</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddUrlModal(true)}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2.5 rounded-xl border border-neutral-300 transition-all flex items-center space-x-1.5 text-sm cursor-pointer"
            >
              <LinkIcon className="w-4 h-4 text-neutral-600" />
              <span>Dán link URL</span>
            </button>
          </div>
        </div>

        {/* Upload Success Alert with Instant Copy URL */}
        {lastUploadedUrl && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-2.5 min-w-0">
              <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-900 block">
                  Tải lên thành công! Đường dẫn sử dụng:
                </span>
                <code className="text-xs font-mono text-emerald-800 truncate block max-w-xs sm:max-w-md select-all font-semibold" title={lastUploadedUrl}>
                  {formatDisplayUrl(lastUploadedUrl)}
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
                  unoptimized={item.url.startsWith('data:') || item.url.startsWith('http')}
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
              <div className="flex items-center bg-neutral-100 rounded-lg p-1.5 border border-neutral-200/80 min-w-0">
                <span className="text-[10px] font-mono text-neutral-600 truncate flex-1 pl-1 min-w-0" title={item.url}>
                  {formatDisplayUrl(item.url)}
                </span>
                <button
                  onClick={() => handleCopy(item.url)}
                  title="Sao chép đường dẫn"
                  className="p-1 hover:bg-white text-neutral-700 rounded transition-colors flex-shrink-0"
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
                      onClick={() => setMediaToDelete(item)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
              <div className="min-w-0 flex-1 pr-4">
                <h3 className="font-bold text-base text-neutral-900 truncate">{previewItem.name}</h3>
                <span className="text-xs text-neutral-500 font-mono block truncate" title={previewItem.url}>
                  {formatDisplayUrl(previewItem.url)}
                </span>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-neutral-400 hover:text-neutral-700 flex-shrink-0">
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
                  unoptimized={previewItem.url.startsWith('data:') || previewItem.url.startsWith('http')}
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

      {/* Add Custom URL Modal */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-neutral-900">Thêm tệp bằng URL</h3>
              </div>
              <button 
                onClick={() => setShowAddUrlModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Đường dẫn hình ảnh hoặc video (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://... hoặc /assets/..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-600 focus:bg-white"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Hỗ trợ link ảnh trực tiếp từ Imgur, Cloudinary, ImgBB hoặc link ảnh web bất kỳ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Tên gợi nhớ (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ví dụ: Banner Lawn Mower Gen 6"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUrlModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Lưu vào thư viện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Delete Confirmation Modal */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900">Xác nhận xóa tệp media</h3>
                <p className="text-xs text-neutral-500">Thao tác này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-xs text-neutral-700 mb-3">
              Bạn có chắc chắn muốn xóa tệp này khỏi thư viện media?
            </p>

            {/* Media Item Snapshot Preview */}
            <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 mb-5">
              <div className="relative w-16 h-16 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {mediaToDelete.mediaType === 'video' ? (
                  <Film className="w-6 h-6 text-neutral-400" />
                ) : (
                  <Image
                    src={mediaToDelete.url}
                    alt={mediaToDelete.name}
                    fill
                    sizes="64px"
                    unoptimized={mediaToDelete.url.startsWith('data:') || mediaToDelete.url.startsWith('http')}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-neutral-900 truncate" title={mediaToDelete.name}>
                  {mediaToDelete.name}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {formatFileSize(mediaToDelete.size)} • {mediaToDelete.mediaType === 'video' ? 'Video' : 'Hình ảnh'}
                </p>
                <div 
                  className="mt-1.5 px-2 py-1 bg-white rounded border border-neutral-200 text-[10px] font-mono text-neutral-500 truncate"
                  title={mediaToDelete.url.startsWith('data:') ? 'Dữ liệu Base64' : mediaToDelete.url}
                >
                  {formatDisplayUrl(mediaToDelete.url)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5">
              <button
                type="button"
                disabled={isDeletingMedia}
                onClick={() => setMediaToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeletingMedia}
                onClick={executeDeleteMedia}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isDeletingMedia ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xác nhận xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {mediaToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 ${
          mediaToast.isError 
            ? 'bg-red-900 text-white border-red-700' 
            : 'bg-neutral-900 text-white border-neutral-800'
        }`}>
          <span>{mediaToast.text}</span>
        </div>
      )}

    </div>
  );
}
