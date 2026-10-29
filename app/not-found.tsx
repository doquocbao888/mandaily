import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">404 - Không tìm thấy trang</h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow"
          >
            <Home className="w-4 h-4" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
