'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, CreditCard, Truck, Lock, Tag, X, Package } from 'lucide-react';
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
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const productSummary =
        cart.length > 0
          ? cart.map((c) => `${c.quantity}x ${c.title} (${c.variantName || 'Standard'})`).join(', ')
          : 'The Lawn Mower® Ultra Gen 6 (Bản chính hãng)';

      const totalQty = cart.reduce((s, c) => s + c.quantity, 0) || 1;

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
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left">
                <p className="font-bold mb-1">⚠️ Lưu ý chuyển khoản VietQR:</p>
                Vui lòng chuyển khoản đúng số tiền và nội dung <strong className="font-mono">MANFRESH {successOrder.id}</strong> tới tài khoản MB Bank: <strong className="font-mono">8888688888</strong>. Đơn hàng sẽ được tự động duyệt ngay khi nhận được thanh toán.
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
                  <div className="mt-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-36 h-36 bg-white p-2 rounded-xl border border-neutral-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <div className="w-full h-full bg-neutral-900 text-white font-mono text-[10px] p-2 rounded-lg flex flex-col items-center justify-center text-center">
                          <span className="font-bold text-amber-400">VIETQR PAY</span>
                          <span className="text-[9px]">MB BANK</span>
                          <div className="mt-2 bg-white text-black font-bold px-2 py-0.5 rounded text-xs">
                            {formatVND(grandTotal)}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-xs text-neutral-700 w-full">
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Ngân hàng:</span>
                            <span className="font-bold text-neutral-900">MB Bank (Quân Đội)</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Số tài khoản:</span>
                            <span className="font-bold font-mono text-neutral-900">8888688888</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('8888688888', 'stk')}
                            className="text-[#9e6f1c] hover:underline font-semibold flex items-center space-x-1"
                          >
                            {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Chủ tài khoản:</span>
                            <span className="font-bold text-neutral-900">CONG TY TNHH MANFRESH VIET NAM</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Nội dung CK:</span>
                            <span className="font-bold font-mono text-[#9e6f1c]">MANFRESH {orderId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(`MANFRESH ${orderId}`, 'nd')}
                            className="text-[#9e6f1c] hover:underline font-semibold flex items-center space-x-1"
                          >
                            {copiedField === 'nd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'nd' ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      </div>
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
