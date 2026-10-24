'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Package,
  ShieldCheck,
  Award,
  X,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-5 z-40 font-sans">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-16 right-0 w-72 bg-[#F4F3ED] text-neutral-900 border border-[#e2dfd5] rounded-3xl p-4 shadow-2xl space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e2d8]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-neutral-900">
                    Hỗ trợ Manscaped™
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200/60 transition cursor-pointer"
                  aria-label="Đóng popup hỗ trợ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Hotline */}
                <a
                  href="tel:19008888"
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#faf9f6] border border-[#e5e2d8] text-left transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#c59b63] text-black flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Hotline CSKH</span>
                    <span className="block text-[11px] text-[#9e6f1c] font-bold">1900 8888 (Miễn phí)</span>
                  </div>
                </a>

                {/* Zalo Support */}
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#faf9f6] border border-[#e5e2d8] text-left transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0068ff] text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Chat Zalo 24/7</span>
                    <span className="block text-[11px] text-neutral-500 font-medium">Tư vấn chọn sản phẩm</span>
                  </div>
                </a>

                {/* Order Tracking */}
                <Link
                  href="/tracking"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#faf9f6] border border-[#e5e2d8] text-left transition group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#eae8e1] text-[#9e6f1c] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Tra cứu đơn hàng</span>
                    <span className="block text-[11px] text-neutral-500 font-medium">Kiểm tra lộ trình giao</span>
                  </div>
                </Link>

                {/* Warranty Policy */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setActivePolicyModal('warranty');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white hover:bg-[#faf9f6] border border-[#e5e2d8] text-left transition group cursor-pointer shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-900">Bảo hành chính hãng 2 năm</span>
                    <span className="block text-[11px] text-neutral-500 font-medium">1 đổi 1 lỗi nhà sản xuất</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-13 h-13 rounded-full bg-black text-white border-2 border-[#c59b63] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Liên hệ hỗ trợ Manscaped"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#c59b63]" />
          ) : (
            <>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#c59b63] border-2 border-black flex items-center justify-center animate-bounce" />
              <HelpCircle className="w-6 h-6 text-[#c59b63] group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Policy Details Modal */}
      <AnimatePresence>
        {activePolicyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePolicyModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#F4F3ED] text-neutral-900 border border-[#e5e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#e5e2d8]">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#9e6f1c]" />
                    <h3 className="font-extrabold text-base uppercase tracking-tight text-neutral-900">
                      Chính Sách Manscaped™ Toàn Cầu
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal(null)}
                    className="p-1 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200/60 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-white border border-[#e5e2d8] space-y-1 shadow-2xs">
                    <span className="font-bold text-[#9e6f1c] block text-xs uppercase tracking-wider">
                      1. Bảo hành chính hãng 2 năm
                    </span>
                    <p className="text-neutral-600">
                      Tất cả tông đơ và thiết bị điện tử Manscaped được áp dụng chính sách bảo hành 24 tháng, hỗ trợ đổi mới 1-1 nếu có lỗi kỹ thuật từ nhà sản xuất.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#e5e2d8] space-y-1 shadow-2xs">
                    <span className="font-bold text-[#9e6f1c] block text-xs uppercase tracking-wider">
                      2. Cam kết hoàn tiền 30 ngày (Money-Back Guarantee)
                    </span>
                    <p className="text-neutral-600">
                      Nếu không hoàn toàn hài lòng về độ êm ái của công nghệ cạo SkinSafe™, quý khách có thể yêu cầu đổi trả hoặc hoàn tiền trong vòng 30 ngày kể từ ngày nhận hàng.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#e5e2d8] space-y-1 shadow-2xs">
                    <span className="font-bold text-[#9e6f1c] block text-xs uppercase tracking-wider">
                      3. Giao hàng miễn phí & Đóng gói kín đáo
                    </span>
                    <p className="text-neutral-600">
                      Miễn phí vận chuyển cho đơn hàng từ $49. Hộp kiện được đóng gói kín đáo, không để lộ thông tin sản phẩm bên trong để đảm bảo sự riêng tư tuyệt đối.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal(null)}
                    className="px-6 py-2.5 bg-black hover:bg-[#9e6f1c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Đã hiểu
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
