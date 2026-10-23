'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    openCheckout,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const freeShippingThreshold = 50.0;
  const progress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - totalPrice);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Slide-out Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-neutral-900 text-white">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span className="font-bold tracking-wider uppercase text-base">
                  Giỏ hàng của bạn ({totalItems})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Đóng giỏ hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="bg-neutral-100 px-6 py-3 border-b border-neutral-200">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-800 mb-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                {remainingForFree > 0 ? (
                  <span>
                    Mua thêm <strong className="text-amber-800">${remainingForFree.toFixed(2)}</strong> để được Miễn Phí Vận Chuyển!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">🎉 Bạn đã được Miễn Phí Vận Chuyển toàn quốc!</span>
                )}
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">Giỏ hàng trống</h3>
                  <p className="text-sm text-neutral-500 max-w-xs mb-6">
                    Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các thiết bị chăm sóc cao cấp của chúng tôi!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all uppercase tracking-wider shadow-md"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variantName || 'default'}`}
                    className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 shadow-xs relative group"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-neutral-200 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-neutral-900 truncate">{item.title}</h4>
                      <p className="text-xs text-neutral-500 truncate">{item.subtitle}</p>
                      {item.variantName && (
                        <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded mt-1 uppercase">
                          {item.variantName}
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="font-extrabold text-neutral-900 text-sm">
                          ${(item.numericPrice * item.quantity).toFixed(2)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden h-8">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantName)}
                            className="px-2.5 text-neutral-600 hover:bg-neutral-100 font-bold text-xs transition-colors"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantName)}
                            className="px-2.5 text-neutral-600 hover:bg-neutral-100 font-bold text-xs transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.variantName)}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-red-600 transition-colors p-1"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-neutral-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-emerald-700">
                      {remainingForFree === 0 ? 'Miễn phí' : '$5.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Tổng cộng</span>
                    <span className="text-lg text-amber-700">
                      ${(totalPrice + (remainingForFree === 0 ? 0 : 5.0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    openCheckout();
                  }}
                  className="w-full bg-[#b78103] hover:bg-[#a17102] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-base uppercase tracking-wider cursor-pointer"
                >
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-xs text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Bảo mật thanh toán &amp; Cam kết chính hãng 100%</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
