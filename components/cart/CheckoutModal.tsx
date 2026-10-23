'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { createOrderInDb } from '@/lib/dbService';

export default function CheckoutModal() {
  const { cart, totalPrice, isCheckoutOpen, setIsCheckoutOpen, clearCart, orderId } = useCart();

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

  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const shippingFee = totalPrice >= 50 ? 0 : 5.0;
  const grandTotal = totalPrice + shippingFee;

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
      const productSummary = cart.map((c) => `${c.quantity}x ${c.title} (${c.variantName || 'Standard'})`).join(', ');

      await createOrderInDb({
        id: orderId,
        customerName: fullName,
        phone: phone,
        address: address,
        productName: productSummary,
        variant: paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR',
        quantity: cart.reduce((s, c) => s + c.quantity, 0),
        totalPrice: `$${grandTotal.toFixed(2)}`,
        status: 'Đang xử lý',
        createdAt: new Date().toLocaleString('vi-VN'),
      });

      setSuccessOrder({
        id: orderId,
        fullName,
        phone,
        address,
        total: grandTotal,
        method: paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VietQR',
      });
      clearCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      setSuccessOrder({
        id: orderId,
        fullName,
        phone,
        address,
        total: grandTotal,
        method: paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VietQR',
      });
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!successOrder) setIsCheckoutOpen(false);
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-neutral-900 text-white">
            <h3 className="text-lg font-bold tracking-wide uppercase">
              {successOrder ? 'Đặt hàng thành công!' : 'Thanh toán đơn hàng'}
            </h3>
            {!successOrder && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {successOrder ? (
            /* Success Confirmation Screen */
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-2xl font-serif font-bold text-neutral-900 mb-1">
                  Cảm ơn bạn đã đặt hàng, {successOrder.fullName}!
                </h4>
                <p className="text-sm text-neutral-600">
                  Mã đơn hàng của bạn: <strong className="text-neutral-900 font-mono bg-neutral-100 px-2 py-0.5 rounded">{successOrder.id}</strong>
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
                  <span className="font-semibold text-amber-700">{successOrder.method}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span className="text-neutral-900">Tổng thanh toán:</span>
                  <span className="text-neutral-900">${successOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {successOrder.method.includes('VietQR') && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left">
                  <p className="font-bold mb-1">⚠️ Lưu ý chuyển khoản VietQR:</p>
                  Vui lòng quét mã QR hoặc chuyển khoản đúng số tiền và nội dung <strong className="font-mono">MANSCAPED {successOrder.id}</strong>. Đơn hàng sẽ được tự động xác nhận sau khi nhận được thanh toán.
                </div>
              )}

              <button
                onClick={() => {
                  setSuccessOrder(null);
                  setIsCheckoutOpen(false);
                }}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all uppercase tracking-wider shadow-md text-sm"
              >
                Hoàn tất &amp; Trở về trang chủ
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-bold uppercase text-neutral-900 tracking-wider mb-3 flex items-center space-x-2">
                  <span>1. Thông tin giao hàng</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none bg-neutral-50"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none bg-neutral-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Địa chỉ nhận hàng cụ thể *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số 123, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none bg-neutral-50"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Ghi chú đơn hàng (tuỳ chọn)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao hàng giờ hành chính..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none bg-neutral-50"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-sm font-bold uppercase text-neutral-900 tracking-wider mb-3">
                  2. Phương thức thanh toán
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-start space-x-3 ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/20 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-sm text-neutral-900">
                        <Truck className="w-4 h-4 text-amber-700" />
                        <span>Thanh toán COD</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.
                      </p>
                    </div>
                  </div>

                  {/* VietQR Option */}
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-start space-x-3 ${
                      paymentMethod === 'vietqr'
                        ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/20 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-sm text-neutral-900">
                        <CreditCard className="w-4 h-4 text-amber-700" />
                        <span>Chuyển khoản VietQR</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        Quét mã QR qua ứng dụng ngân hàng di động hoặc Momo, VNPay. Xác nhận tự động nhanh chóng.
                      </p>
                    </div>
                  </div>
                </div>

                {/* VietQR Display Details */}
                {paymentMethod === 'vietqr' && (
                  <div className="mt-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 animate-fadeIn space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Simulated QR Code Box */}
                      <div className="relative w-36 h-36 bg-white p-2 rounded-xl border border-neutral-300 shadow-inner flex items-center justify-center flex-shrink-0">
                        <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-white text-[10px] font-mono p-2 text-center rounded-lg">
                          <span className="font-bold text-amber-400 mb-1">VIETQR PAY</span>
                          <span className="text-[9px] text-neutral-300">MB BANK</span>
                          <div className="mt-2 bg-white text-black font-bold px-2 py-1 rounded text-xs">
                            ${grandTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Bank Details & Copy Buttons */}
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
                            className="text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1"
                          >
                            {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Chủ tài khoản:</span>
                            <span className="font-bold text-neutral-900">CONG TY TNHH MANSCAPED VIET NAM</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Nội dung chuyển khoản:</span>
                            <span className="font-bold font-mono text-amber-700">MANSCAPED {orderId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(`MANSCAPED ${orderId}`, 'nd')}
                            className="text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1"
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

              {/* Order Summary Box */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Tạm tính sản phẩm:</span>
                  <span className="font-semibold text-neutral-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 text-xs">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingFee === 0 ? 'Miễn phí' : '$5.00'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-200 text-neutral-900">
                  <span>Tổng thanh toán:</span>
                  <span className="text-amber-700">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#b78103] hover:bg-[#a17102] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Xác nhận đặt hàng (${grandTotal.toFixed(2)})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-xs text-neutral-500 pb-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Bảo mật thông tin khách hàng tuyệt đối</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
