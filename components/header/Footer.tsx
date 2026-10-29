'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-black text-white font-sans select-none">
      {/* 1. TOP TRUST BADGES BAR */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-7">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 text-[13px] sm:text-[14px] font-medium text-white tracking-wide">
          {/* Money-Back Guarantee */}
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#c59b63] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
              <path d="M12 7v10M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 1.5 5 4.5a2.5 2.5 0 0 1-5 0" />
            </svg>
            <span>Cam kết hoàn tiền</span>
          </div>

          {/* Free Shipping */}
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#c59b63] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <path d="M12 8v13M3 13h18M12 8C12 5 9 5 8 7c-1 2 2 1 4 1zM12 8c0-3 3-3 4-1 1 2-2 1-4 1z" />
            </svg>
            <span>Miễn phí vận chuyển đơn từ 500.000đ</span>
          </div>

          {/* 2-Year Warranty */}
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#c59b63] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Bảo hành chính hãng 24 tháng</span>
          </div>
        </div>

        {/* Divider line under trust bar */}
        <div className="w-full h-[1px] bg-neutral-800/90 mt-8" />
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-14">
        {/* Top 3 Columns: Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 mb-16">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-[#c59b63] text-[15px] font-bold tracking-wide mb-5 uppercase">
              Về MANFRESH
            </h3>
            <ul className="space-y-3.5 text-[14px] text-white">
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Đội ngũ lãnh đạo
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Báo chí &amp; Truyền thông
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Cơ hội nghề nghiệp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Tin tức &amp; Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Hỏi đáp thường gặp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Bằng sáng chế &amp; Công nghệ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Đánh giá từ khách hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Experience */}
          <div>
            <h3 className="text-[#c59b63] text-[15px] font-bold tracking-wide mb-5 uppercase">
              Trải nghiệm khách hàng
            </h3>
            <ul className="space-y-3.5 text-[14px] text-white">
              <li>
                <Link href="/tracking" className="hover:text-[#c59b63] transition-colors font-medium">
                  Tra cứu đơn hàng trực tuyến
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#c59b63] transition-colors">
                  Bộ sưu tập sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-[#c59b63] transition-colors">
                  Chính sách bảo hành &amp; Đổi trả 30 ngày
                </Link>
              </li>
              <li>
                <Link href="tel:19008888" className="hover:text-[#c59b63] transition-colors font-semibold">
                  Hotline hỗ trợ: 1900 8888
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Terms */}
          <div>
            <h3 className="text-[#c59b63] text-[15px] font-bold tracking-wide mb-5 uppercase">
              Chính sách &amp; Điều khoản
            </h3>
            <ul className="space-y-3.5 text-[14px] text-white">
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Điều khoản sử dụng &amp; Mua bán
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Chính sách Cookie
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Minh bạch chuỗi cung ứng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Thông báo thu thập thông tin
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Cam kết không bán thông tin cá nhân
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Bảo vệ thông tin cá nhân nhạy cảm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#c59b63] transition-colors">
                  Cài đặt quyền riêng tư
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Half: Payment Methods + Social (Left) & Newsletter Signup (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
          {/* Left Column: Payment & Social */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {/* Accepted payment methods */}
            <div className="mb-9">
              <h4 className="text-white text-[15px] sm:text-[16px] font-bold mb-4 tracking-tight">
                Phương thức thanh toán chấp nhận
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {/* VISA */}
                <div className="w-[44px] h-[26px] bg-white rounded-[4px] flex items-center justify-center p-1 shadow-xs border border-neutral-300">
                  <span className="text-[#1a1f71] font-black italic text-[11px] tracking-tighter">
                    VISA
                  </span>
                </div>

                {/* Mastercard */}
                <div className="w-[44px] h-[26px] bg-[#1a1a1a] rounded-[4px] flex items-center justify-center p-1 shadow-xs border border-neutral-700">
                  <div className="flex items-center -space-x-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] opacity-90" />
                  </div>
                </div>

                {/* AMEX */}
                <div className="w-[44px] h-[26px] bg-[#006fcf] rounded-[4px] flex items-center justify-center p-1 shadow-xs">
                  <span className="text-white font-black text-[9px] leading-none tracking-tight text-center">
                    AM<br />EX
                  </span>
                </div>

                {/* Discover */}
                <div className="w-[48px] h-[26px] bg-white rounded-[4px] flex items-center justify-center p-1 shadow-xs border border-neutral-300">
                  <div className="flex items-center">
                    <span className="text-[#231f20] font-bold text-[8px] tracking-tight">DISC</span>
                    <div className="w-2 h-2 rounded-full bg-[#f68b1e] mx-[1px]" />
                    <span className="text-[#231f20] font-bold text-[8px] tracking-tight">VER</span>
                  </div>
                </div>

                {/* UnionPay */}
                <div className="w-[44px] h-[26px] bg-[#d9232e] rounded-[4px] flex items-center justify-center p-1 shadow-xs border border-neutral-600">
                  <span className="text-white font-bold text-[8px] tracking-tighter">
                    UnionPay
                  </span>
                </div>

                {/* Apple Pay */}
                <div className="w-[48px] h-[26px] bg-white rounded-[4px] flex items-center justify-center px-1.5 shadow-xs border border-neutral-300">
                  <div className="flex items-center gap-1 text-black">
                    <svg className="w-2.5 h-2.5 fill-black" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.41-9.79-11.45-20.94-15.11-33.45-3.66-12.51-5.49-23.95-5.49-34.33 0-14.35 3.6-26.04 10.8-35.07 7.2-9.03 16.03-13.67 26.5-13.92 5.23 0 10.74 1.34 16.54 4.02 5.8 2.68 9.63 4.07 11.48 4.17 1.45 0 5.48-1.52 12.08-4.57 6.6-3.04 12.33-4.35 17.18-3.92 13.33.63 23.47 5.3 30.43 14.02-11.66 7.07-17.38 16.64-17.18 28.71.22 9.57 3.84 17.5 10.87 23.8 7.03 6.3 15.33 9.89 24.9 10.76-2.28 7.07-5.22 14.54-8.81 22.41zM119.22 31.84c0-7.28 2.64-14.02 7.93-20.22 5.29-6.2 11.85-10.43 19.68-12.69.22 1.09.33 2.18.33 3.26 0 7.28-2.72 14.13-8.15 20.55-5.44 6.41-11.96 10.43-19.57 12.06-.07-1-.22-1.99-.22-2.96z" />
                    </svg>
                    <span className="font-semibold text-[9px] tracking-tight">Pay</span>
                  </div>
                </div>

                {/* Google Pay */}
                <div className="w-[48px] h-[26px] bg-white rounded-[4px] flex items-center justify-center px-1.5 shadow-xs border border-neutral-300">
                  <div className="flex items-center gap-0.5">
                    <span className="font-bold text-[10px] text-[#4285F4]">G</span>
                    <span className="font-semibold text-[9px] text-[#5f6368] tracking-tight">Pay</span>
                  </div>
                </div>

                {/* Shop Pay */}
                <div className="w-[48px] h-[26px] bg-[#5a31f4] rounded-[4px] flex items-center justify-center px-1 shadow-xs">
                  <span className="text-white font-bold text-[8.5px] tracking-tight">
                    shop<span className="text-[#00ffff]">Pay</span>
                  </span>
                </div>

                {/* Klarna */}
                <div className="w-[48px] h-[26px] bg-[#ffb3c7] rounded-[4px] flex items-center justify-center px-1 shadow-xs">
                  <span className="text-black font-extrabold text-[8.5px] tracking-tighter">
                    Klarna.
                  </span>
                </div>
              </div>

              {/* Second row of payment methods */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Venmo */}
                <div className="w-[44px] h-[26px] bg-[#008cff] rounded-[4px] flex items-center justify-center p-1 shadow-xs">
                  <span className="text-white font-black italic text-[13px] leading-none">
                    v
                  </span>
                </div>

                {/* PayPal */}
                <div className="w-[48px] h-[26px] bg-white rounded-[4px] flex items-center justify-center px-1 shadow-xs border border-neutral-300">
                  <div className="flex items-center -space-x-0.5">
                    <span className="text-[#003087] font-black italic text-[11px]">P</span>
                    <span className="text-[#0079C1] font-black italic text-[11px]">P</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow us on social */}
            <div>
              <h4 className="text-white text-[15px] sm:text-[16px] font-bold mb-4 tracking-tight">
                Theo dõi MANFRESH trên mạng xã hội
              </h4>
              <div className="flex items-center gap-4 sm:gap-5 text-white">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com/manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.17-1.75 1.73-1.75H17.5V2.14C16.89 2.06 15.65 2 14.34 2 10.87 2 8.5 4.12 8.5 8v2.5H5v4h3.5V22h5.5v-8.5z" />
                  </svg>
                </a>

                {/* 2. Instagram */}
                <a
                  href="https://instagram.com/manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* 3. X (Twitter) */}
                <a
                  href="https://twitter.com/manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 4. YouTube */}
                <a
                  href="https://youtube.com/manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </a>

                {/* 5. Pinterest */}
                <a
                  href="https://pinterest.com/manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg className="w-4 h-5 fill-current" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-38.1 24.9-75 24.9-114.3 0-72.9-103.2-59.7-103.2 27.6 0 17.7 2.4 36.9 10.8 52.8l-37.5 158.1C62.7 442.2 82.5 503.7 84 508.5c1.5 4.8 5.4 3.9 7.5-.9 3-6.9 41.7-57.9 51.6-96.9 4.2-16.2 21.6-83.7 21.6-83.7 10.5 19.8 41.1 36.9 73.5 36.9 102.3 0 145.8-97.2 145.8-192.6C384 75.3 294.6 6.5 204 6.5z" />
                  </svg>
                </a>

                {/* 6. TikTok */}
                <a
                  href="https://tiktok.com/@manfresh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-6 h-6 flex items-center justify-center text-white hover:text-[#c59b63] transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.35 0 .69.07 1 .2v-3.52a6.37 6.37 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.18 8.18 0 0 0 4.76 1.52V6.78a4.83 4.83 0 0 1-1-.09z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Newsletter Signup */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h4 className="text-white text-[17px] sm:text-[19px] font-bold mb-4 tracking-tight">
              Nhận thông tin ưu đãi và sản phẩm mới sớm nhất
            </h4>

            {subscribed ? (
              <div className="bg-[#b88243]/20 border border-[#b88243] rounded p-4 text-[#c59b63] text-sm">
                Cảm ơn bạn đã đăng ký nhận thông tin từ MANFRESH!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                {/* Email Input */}
                <div className="w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NHẬP EMAIL CỦA BẠN*"
                    className="w-full bg-black border border-neutral-700 focus:border-white rounded-[2px] px-4 py-3.5 text-white placeholder:text-neutral-500 text-[12px] sm:text-[13px] tracking-wider uppercase outline-none transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-4 bg-[#b88243] hover:bg-[#a67438] active:scale-98 text-white font-bold text-[14px] sm:text-[15px] px-10 py-3 rounded-full transition-all duration-200 cursor-pointer shadow-sm tracking-wide"
                >
                  Đăng ký ngay
                </button>

                {/* Disclaimer */}
                <p className="text-[12px] text-neutral-400 leading-relaxed mt-4">
                  Bằng việc nhập email, bạn đồng ý nhận thông tin về sản phẩm, ưu đãi và chương trình khuyến mãi từ MANFRESH®. Bạn có thể hủy đăng ký bất cứ lúc nào.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM TRADEMARK & LEGAL BAR */}
      <div className="border-t border-neutral-800/80">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl sm:text-[26px] font-black tracking-widest text-white uppercase font-sans">
              MANFRESH
            </span>
          </div>

          {/* Right Text */}
          <div className="flex flex-col text-[11px] sm:text-[12px] text-neutral-400 space-y-1.5 lg:text-right">
            {/* Top row: Copyright & Links */}
            <div className="flex flex-wrap items-center lg:justify-end gap-x-2 gap-y-1">
              <span>Bản quyền © 2026, MANFRESH®. Tất cả quyền được bảo lưu.</span>
              <span className="hidden sm:inline text-neutral-600 mx-1">|</span>
              <Link href="#" className="hover:text-white transition-colors">
                Bảo hành &amp; Đổi trả
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="#" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <span className="text-neutral-600">|</span>
              <Link href="#" className="hover:text-white transition-colors">
                Chính sách Cookie
              </Link>
            </div>

            {/* Bottom row: Registered Trademark Notice */}
            <p className="text-neutral-400">
              Ký hiệu ® đại diện cho thương hiệu đã được đăng ký bản quyền chính thức của MANFRESH.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
