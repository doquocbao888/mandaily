'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { featuredProductsConfig2 } from '@/config/products';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    addToCart,
    totalItems,
    totalPrice,
  } = useCart();

  const freeShippingThreshold = 49.0;
  const progress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - totalPrice);

  // Recommended add-on items for Bundle and Save
  const bundleProducts = featuredProductsConfig2.products.slice(4, 7);

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
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Slide-out Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-[420px] bg-[#f9f8f4] shadow-2xl flex flex-col font-sans"
          >
            {/* Header with Manscaped Bronze/Gold Background */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#9e6f1c] text-white">
              <div className="w-9" /> {/* Spacer */}
              <h2 className="text-base font-bold tracking-widest uppercase text-center flex-1">
                Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black/15 transition-colors cursor-pointer"
                aria-label="Đóng giỏ hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              
              {/* Free Shipping Banner Card */}
              <div className="bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs">
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-800 mb-2">
                  <Truck className="w-4 h-4 text-[#9e6f1c] flex-shrink-0" />
                  {remainingForFree > 0 ? (
                    <span>
                      Add <strong className="text-[#9e6f1c]">${remainingForFree.toFixed(2)}</strong> more for Free Shipping!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold">You qualify for Free Shipping!</span>
                  )}
                </div>
                <div className="relative w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex items-center">
                  <div
                    className="h-full bg-[#9e6f1c] transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute right-1 text-[9px] font-bold text-neutral-600 bg-white/80 px-1 rounded">
                    Free
                  </div>
                </div>
              </div>

              {/* Cart Items Title & VIP Banner Callout */}
              <div>
                <h3 className="text-xl font-serif font-bold text-neutral-900 mb-1">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </h3>
                {cart.length > 0 && (
                  <div className="mt-2.5 p-4 bg-white rounded-xl border border-neutral-200/80 text-xs text-neutral-600 leading-relaxed space-y-1.5">
                    <p className="font-bold text-neutral-900">Saving money looks handsome on you.</p>
                    <p>
                      Your <span className="underline font-medium">VIP Membership</span> enrolls you in a VIP Package subscription that includes <strong className="text-neutral-900">both a fresh trimmer blade and foil blade refill</strong>, billed <strong className="text-neutral-900">every 3 months at $25.00 + tax</strong>. Customize or cancel anytime.
                    </p>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-neutral-200 p-6">
                    <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <p className="font-bold text-neutral-900 mb-1">Your cart is empty</p>
                    <p className="text-xs text-neutral-500 mb-4">Discover our high-end grooming essentials.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow"
                    >
                      Shop now
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.id}-${item.variantName || 'default'}`}
                      className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex gap-4 relative"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-[#f5f5f5] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-neutral-100">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide block">
                            {item.variantName || 'VIP Member Price Applied'}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase leading-tight mt-0.5 line-clamp-2">
                            {item.title}
                          </h4>

                          <div className="flex items-center space-x-2 mt-1.5">
                            <span className="font-bold text-neutral-900 text-sm">
                              ${(item.numericPrice * item.quantity).toFixed(2)}
                            </span>
                            {item.variantName?.includes('VIP') && (
                              <>
                                <span className="text-neutral-400 line-through text-xs">
                                  ${(item.numericPrice * 1.1 * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-xs text-emerald-700 font-semibold">
                                  You Saved 8% (-${(item.numericPrice * 0.1 * item.quantity).toFixed(2)})
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity & Delete Controls */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                          <div className="flex items-center border border-neutral-300 rounded-full bg-white overflow-hidden h-8 px-1">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  removeFromCart(item.id, item.variantName);
                                } else {
                                  updateQuantity(item.id, item.quantity - 1, item.variantName);
                                }
                              }}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-full transition"
                              title="Giảm"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-600" /> : '–'}
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantName)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-full transition font-bold"
                              title="Tăng"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bundle and Save Carousel Section */}
              <div className="bg-[#f0eee6] rounded-2xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase">
                    Bundle and Save
                  </h4>
                  <div className="flex space-x-1.5">
                    <button className="w-6 h-6 rounded-full bg-white/80 border border-neutral-300 flex items-center justify-center text-neutral-600 text-xs">
                      ‹
                    </button>
                    <button className="w-6 h-6 rounded-full bg-[#9e6f1c] text-white flex items-center justify-center text-xs">
                      ›
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {bundleProducts.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-xl p-3 border border-neutral-200 flex flex-col justify-between">
                      <div className="relative w-full h-24 bg-neutral-50 rounded-lg mb-2 flex items-center justify-center">
                        <Image
                          src={prod.imageSrc}
                          alt={prod.title}
                          fill
                          sizes="130px"
                          className="object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-neutral-900 line-clamp-1">{prod.title}</h5>
                        <p className="text-xs font-extrabold text-[#9e6f1c] mt-0.5">{prod.vipPrice}</p>
                      </div>
                      <button
                        onClick={() => addToCart({
                          id: prod.id,
                          title: prod.title,
                          subtitle: prod.subtitle,
                          price: prod.vipPrice,
                          numericPrice: parseFloat(prod.vipPrice.replace('$', '')) || 15.99,
                          quantity: 1,
                          imageSrc: prod.imageSrc,
                          variantName: 'Add-on'
                        })}
                        className="mt-2 w-full bg-black hover:bg-neutral-800 text-white font-bold text-[11px] py-1.5 rounded-lg uppercase tracking-wider transition"
                      >
                        Add To Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-2 text-xs">
                <h4 className="font-bold text-neutral-900 text-sm mb-2">Summary</h4>
                <div className="flex justify-between text-neutral-600">
                  <span>Total Product Value</span>
                  <span className="font-semibold text-neutral-900">${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {remainingForFree === 0 ? 'Free' : '$5.00'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-neutral-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base pt-2 border-t border-neutral-200 text-neutral-900">
                  <span>Estimated Total</span>
                  <span className="text-[#9e6f1c]">${(totalPrice + (remainingForFree === 0 ? 0 : 5.0)).toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Footer Trust Badges & Checkout Button */}
            <div className="p-4 bg-white border-t border-neutral-200 space-y-3">
              {/* Trust Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-600 font-medium py-1">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-[#9e6f1c] mb-1" />
                  <span>MONEY-BACK GUARANTEE</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-[#9e6f1c] mb-1" />
                  <span>FREE SHIPPING OVER $49</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-5 h-5 text-[#9e6f1c] mb-1" />
                  <span>2-YEAR WARRANTY</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#9e6f1c] hover:bg-[#8b5f16] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-widest cursor-pointer"
              >
                <span>Checkout</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
