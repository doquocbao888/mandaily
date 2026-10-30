'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  CreditCard,
  Truck,
  Lock,
  Tag,
  X,
  Package,
  QrCode,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrderInDb } from '@/lib/dbService';
import { formatVND } from '@/lib/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    id: string;
    fullName: string;
    phone: string;
    address: string;
    total: number;
    method: string;
  } | null>(null);

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [orderId] = useState(() => `ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (code === 'MANFRESH10' || code === 'SALE15' || code === 'FREESHIP') {
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      setPromoError('Mã không hợp lệ. Thử MANFRESH10 hoặc FREESHIP');
    }
  };

  const discountAmount = appliedPromo === 'MANFRESH10'
    ? totalPrice * 0.1
    : appliedPromo === 'SALE15'
    ? totalPrice * 0.15
    : 0;

  const shippingFee = (totalPrice >= 500000 || appliedPromo === 'FREESHIP') ? 0 : 30000;
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.');
      router.push('/products');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const productSummary = cart
        .map((c) => `${c.quantity}x ${c.title} (${c.variantName || 'Bản chính hãng'})`)
        .join(', ');

      const totalQty = cart.reduce((s, c) => s + c.quantity, 0);

      await createOrderInDb({
        id: orderId,
        customerName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        productName: productSummary,
        variant: paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR',
        quantity: totalQty,
        totalPrice: formatVND(grandTotal),
        status: 'Đang xử lý',
        createdAt: new Date().toLocaleString('vi-VN'),
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'VietQR',
        notes: note.trim() || '',
        discountCode: appliedPromo || '',
        discountAmount: discountAmount > 0 ? `-${formatVND(discountAmount)}` : '',
      });

      setSuccessOrder({
        id: orderId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        total: grandTotal,
        method: paymentMethod === 'cod' ? 'Thanh toán COD (Nhận hàng trả tiền)' : 'Chuyển khoản VietQR',
      });
      clearCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      // Still set success order as it was securely saved to local storage backup
      setSuccessOrder({
        id: orderId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        total: grandTotal,
        method: paymentMethod === 'cod' ? 'Thanh toán COD (Nhận hàng trả tiền)' : 'Chuyển khoản VietQR',
      });
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-neutral-900 font-sans flex flex-col">
      
      {/* Top Brand Bar */}
      <header className="bg-white border-b border-neutral-200 py-4 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-widest uppercase text-black">
          MANFRESH
        </Link>
        <div className="flex items-center space-x-1.5 text-xs text-neutral-600 font-medium">
          <Lock className="w-4 h-4 text-[#9e6f1c]" />
          <span>Thanh toán bảo mật</span>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {successOrder ? (
          /* Success Screen */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-neutral-200 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-neutral-900 mb-1">
                Cảm ơn bạn đã đặt hàng, {successOrder.fullName}!
              </h2>
              <p className="text-sm text-neutral-600">
                Mã đơn hàng: <strong className="text-neutral-900 font-mono bg-neutral-100 px-2.5 py-1 rounded">{successOrder.id}</strong>
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-5 text-left border border-neutral-200 space-y-3 text-sm">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Người nhận:</span>
                <span className="font-semibold text-neutral-900">{successOrder.fullName} ({successOrder.phone})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Địa chỉ giao hàng:</span>
                <span className="font-semibold text-neutral-900 max-w-[280px] text-right">{successOrder.address}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Phương thức thanh toán:</span>
                <span className="font-semibold text-[#9e6f1c]">{successOrder.method}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span className="text-neutral-900">Tổng thanh toán:</span>
                <span className="text-[#9e6f1c]">{formatVND(successOrder.total)}</span>
              </div>
            </div>

            {successOrder.method.includes('VietQR') && (
              <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 text-left space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-[#9e6f1c]" />
                    <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
                      Quét mã VietQR thanh toán ngay
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                    Napas 247 tức thì
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5">
                  {/* Real Dynamic VietQR Code - Enriched and enlarged */}
                  <div className="bg-white p-3 rounded-2xl border-2 border-amber-200/90 shadow-md flex flex-col items-center flex-shrink-0 w-64 sm:w-72">
                    <Image
                      src={`/api/vietqr?amount=${successOrder.total}&memo=${encodeURIComponent(`MANFRESH ${successOrder.id}`)}`}
                      alt="VietQR VIB - DO QUOC BAO"
                      width={280}
                      height={280}
                      className="w-full h-auto object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                      priority
                    />
                    <a
                      href={`https://img.vietqr.io/image/vib-023118718-compact2.svg?amount=${successOrder.total}&addInfo=${encodeURIComponent(`MANFRESH ${successOrder.id}`)}&accountName=${encodeURIComponent('DO QUOC BAO')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 text-xs font-bold text-[#9e6f1c] hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem ảnh phóng to</span>
                    </a>
                  </div>

                  {/* Account Details */}
                  <div className="flex-1 space-y-2 text-xs text-neutral-800 w-full">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Ngân hàng thụ hưởng:</span>
                        <span className="font-bold text-neutral-900">VIB (Ngân hàng TMCP Quốc Tế Việt Nam)</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Số tài khoản (STK):</span>
                        <span className="font-bold font-mono text-base text-neutral-900">023118718</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('023118718', 'success_stk')}
                        className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                      >
                        {copiedField === 'success_stk' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Chủ tài khoản:</span>
                        <span className="font-bold text-neutral-900 uppercase">DO QUOC BAO</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Số tiền cần chuyển:</span>
                        <span className="font-bold font-mono text-sm text-[#9e6f1c]">{formatVND(successOrder.total)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(String(successOrder.total), 'success_amount')}
                        className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                      >
                        {copiedField === 'success_amount' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Nội dung chuyển khoản:</span>
                        <span className="font-bold font-mono text-sm text-[#9e6f1c]">MANFRESH {successOrder.id}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(`MANFRESH ${successOrder.id}`, 'success_memo')}
                        className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                      >
                        {copiedField === 'success_memo' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed bg-amber-100/50 p-2.5 rounded-xl border border-amber-200/50">
                  ⚡ <strong>Gợi ý:</strong> Quý khách chỉ cần mở ứng dụng ngân hàng (VIB, Vietcombank, Techcombank, MB, BIDV, MoMo...) và quét mã QR ở trên. Hệ thống sẽ tự động điền đúng Số tài khoản, Số tiền và Nội dung chuyển tiền mà không cần nhập thủ công.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/tracking?id=${successOrder.id}`)}
                className="flex-1 bg-neutral-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Package className="w-4 h-4 text-[#c59b63]" />
                <span>Tra cứu tiến độ giao hàng</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-[#9e6f1c] hover:bg-[#8b5f16] text-white font-bold py-3.5 px-6 rounded-xl transition-all uppercase tracking-wider shadow-md text-xs cursor-pointer"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        ) : (
          /* 2-Column Checkout Layout */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Shipping & Payment */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Shipping Address Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
                <h2 className="text-lg font-sans font-bold text-neutral-900 uppercase tracking-wide">
                  Địa chỉ giao hàng
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#9e6f1c] focus:outline-none bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0909123456"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#9e6f1c] focus:outline-none bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Địa chỉ nhận hàng chi tiết *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số 123, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#9e6f1c] focus:outline-none bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Ghi chú đơn hàng (Tuỳ chọn)</label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú giao hàng (ví dụ: giao giờ hành chính)..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-[#9e6f1c] focus:outline-none bg-neutral-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
                <h2 className="text-lg font-sans font-bold text-neutral-900 uppercase tracking-wide">
                  Phương thức thanh toán
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-start space-x-3 ${
                      paymentMethod === 'cod'
                        ? 'border-[#9e6f1c] bg-amber-50/30 ring-1 ring-[#9e6f1c]/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#9e6f1c] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-sm text-neutral-900">
                        <Truck className="w-4 h-4 text-[#9e6f1c]" />
                        <span>Thanh toán COD</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Thanh toán tiền mặt khi nhận hàng.</p>
                    </div>
                  </div>

                  {/* VietQR */}
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-start space-x-3 ${
                      paymentMethod === 'vietqr'
                        ? 'border-[#9e6f1c] bg-amber-50/30 ring-1 ring-[#9e6f1c]/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="mt-1 accent-[#9e6f1c] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-sm text-neutral-900">
                        <CreditCard className="w-4 h-4 text-[#9e6f1c]" />
                        <span>Chuyển khoản VietQR</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">Quét QR chuyển khoản ngân hàng nhanh.</p>
                    </div>
                  </div>
                </div>

                {/* VietQR Details Box */}
                {paymentMethod === 'vietqr' && (
                  <div className="mt-4 p-5 bg-amber-50/60 rounded-2xl border-2 border-amber-300/80 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-5 h-5 text-[#9e6f1c]" />
                        <span className="font-bold text-neutral-900 text-sm">
                          Mã VietQR chuyển khoản nhanh 24/7
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Tự động khớp lệnh
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-5">
                      {/* Real Dynamic VietQR Image - Enriched and enlarged */}
                      <div className="bg-white p-3 rounded-2xl border-2 border-amber-200/90 shadow-md flex flex-col items-center flex-shrink-0 w-60 sm:w-68">
                        <Image
                          src={`/api/vietqr?amount=${grandTotal}&memo=${encodeURIComponent(`MANFRESH ${orderId}`)}`}
                          alt="VietQR VIB - DO QUOC BAO"
                          width={280}
                          height={280}
                          className="w-full h-auto object-contain rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <a
                          href={`https://img.vietqr.io/image/vib-023118718-compact2.svg?amount=${grandTotal}&addInfo=${encodeURIComponent(`MANFRESH ${orderId}`)}&accountName=${encodeURIComponent('DO QUOC BAO')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 text-xs font-bold text-[#9e6f1c] hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Mở ảnh QR lớn</span>
                        </a>
                      </div>

                      {/* Account Details */}
                      <div className="flex-1 space-y-2 text-xs text-neutral-800 w-full">
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                          <div>
                            <span className="text-neutral-500 block text-[10px]">Ngân hàng:</span>
                            <span className="font-bold text-neutral-900">VIB (Ngân hàng TMCP Quốc Tế Việt Nam)</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                          <div>
                            <span className="text-neutral-500 block text-[10px]">Số tài khoản (STK):</span>
                            <span className="font-bold font-mono text-base text-neutral-900">023118718</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('023118718', 'stk')}
                            className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                          >
                            {copiedField === 'stk' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                          <div>
                            <span className="text-neutral-500 block text-[10px]">Chủ tài khoản:</span>
                            <span className="font-bold text-neutral-900 uppercase">DO QUOC BAO</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                          <div>
                            <span className="text-neutral-500 block text-[10px]">Số tiền:</span>
                            <span className="font-bold font-mono text-sm text-[#9e6f1c]">{formatVND(grandTotal)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(String(grandTotal), 'amount')}
                            className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                          >
                            {copiedField === 'amount' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100">
                          <div>
                            <span className="text-neutral-500 block text-[10px]">Nội dung CK:</span>
                            <span className="font-bold font-mono text-sm text-[#9e6f1c]">MANFRESH {orderId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(`MANFRESH ${orderId}`, 'nd')}
                            className="bg-amber-100 hover:bg-amber-200 text-[#9e6f1c] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer text-[11px]"
                          >
                            {copiedField === 'nd' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-100/60 p-2.5 rounded-xl text-[11px] text-amber-900/90 leading-relaxed border border-amber-200/60 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#9e6f1c] flex-shrink-0 mt-0.5" />
                      <span>
                        Quét mã QR bằng ứng dụng ngân hàng hoặc MoMo/ZaloPay. STK, số tiền và nội dung sẽ được điền tự động 100%. Quý khách có thể bấm <strong>Hoàn tất đặt hàng</strong> ngay sau khi quét mã.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#9e6f1c] hover:bg-[#8b5f16] text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 text-base uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Hoàn tất đặt hàng ({formatVND(grandTotal)})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </div>

            {/* Right Column: Order Summary (matching screenshot right column) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-lg font-sans font-bold text-neutral-900 uppercase tracking-wide">
                Tóm tắt đơn hàng
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-sm text-neutral-500 text-center py-6">Giỏ hàng trống. <Link href="/" className="underline font-bold text-neutral-900">Mua sắm ngay</Link></p>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.variantName || 'def'}`} className="flex items-center space-x-3 pb-3 border-b border-neutral-100">
                      <div className="relative w-16 h-16 bg-[#f5f5f5] rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200 flex items-center justify-center">
                        <Image src={item.imageSrc} alt={item.title} fill sizes="64px" className="object-contain p-1" referrerPolicy="no-referrer" />
                        <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-neutral-900 truncate">{item.title}</h4>
                        <p className="text-[11px] text-neutral-500 truncate">{item.variantName || 'Mặc định'}</p>
                      </div>
                      <span className="font-extrabold text-xs text-neutral-900">
                        {formatVND(item.numericPrice * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Loyalty Points Banner */}
              <div className="bg-[#eaf7ee] border border-[#c3ebcb] rounded-2xl p-4 flex items-center space-x-3 text-xs text-[#1e6b36]">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span className="font-medium">Bạn nhận được điểm tích lũy thành viên với đơn hàng này.</span>
              </div>

              {/* Promo Code Voucher Form */}
              <div className="pt-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">{appliedPromo}</span>
                      <span className="text-[11px] text-emerald-700">
                        {appliedPromo === 'FREESHIP' ? '(Miễn phí ship)' : appliedPromo === 'SALE15' ? '(-15%)' : '(-10%)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAppliedPromo(null); setPromoError(null); }}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Mã giảm giá (MANFRESH10)"
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs uppercase font-medium outline-none focus:border-[#9e6f1c]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl uppercase tracking-wider transition cursor-pointer"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
                  </div>
                )}
              </div>

              {/* Financial Subtotals in VND */}
              <div className="space-y-2.5 text-sm pt-2 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Tạm tính · {cart.reduce((s, c) => s + c.quantity, 0)} sản phẩm</span>
                  <span className="font-semibold text-neutral-900">{formatVND(totalPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Mã giảm giá ({appliedPromo})</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-sans font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#9e6f1c] font-sans font-extrabold">{formatVND(grandTotal)}</span>
                </div>
              </div>
            </div>

          </form>
        )}
      </main>
    </div>
  );
}
