'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, type ProductItem } from '@/config/products';
import { subscribeProductById, createOrderInDb } from '@/lib/dbService';
import SuperBanner from '@/components/header/SuperBanner';
import Header from '@/components/header/Header';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const initialProduct = getProductById(id);

  const [product, setProduct] = useState<ProductItem | null>(initialProduct || null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<'vip' | 'regular'>('vip');
  const [quantity, setQuantity] = useState(1);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const unsub = subscribeProductById(id, (updatedProd) => {
      if (isMounted && updatedProd) {
        setProduct(updatedProd);
      }
    });
    return () => {
      isMounted = false;
      try {
        unsub();
      } catch {
        // ignore
      }
    };
  }, [id]);

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    setAddedToast(true);
    // Create new order in Firestore cloud database
    try {
      await createOrderInDb({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: 'Khách hàng mới',
        phone: '0909' + Math.floor(100000 + Math.random() * 900000),
        address: 'Hồ Chí Minh, Việt Nam',
        productName: product.title,
        variant: selectedVariant === 'vip' ? 'VIP Member Price' : 'Regular Price',
        quantity: quantity,
        totalPrice: selectedVariant === 'vip' ? product.vipPrice : product.regularPrice,
        status: 'Đang xử lý',
        createdAt: new Date().toLocaleString('vi-VN'),
      });
    } catch (e) {
      console.error('Failed to create order:', e);
    }
    setTimeout(() => setAddedToast(false), 3500);
  };


  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1a1a1a] flex flex-col font-sans select-none">
      <SuperBanner />
      <Header />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1e1e1e] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-amber-500/30 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Đã thêm vào giỏ hàng thành công!</p>
            <p className="text-xs text-neutral-300">{product.title} ({selectedVariant === 'vip' ? 'VIP Member' : 'Regular Price'})</p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Product Layout matching Manscaped reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Vertical Thumbnails + Large Main Image Display */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            
            {/* Vertical Thumbnail List on Left */}
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] scrollbar-thin">
              {product.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all bg-[#f2f1ec] ${
                    selectedImageIndex === idx 
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10 scale-105 shadow-sm' 
                      : 'border-neutral-200/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${idx}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Box */}
            <div className="relative flex-1 aspect-[1/1] sm:aspect-[4/3.8] bg-[#f5f3ec] rounded-xl overflow-hidden flex items-center justify-center p-0 border border-neutral-200/80 shadow-sm group">
              
              {/* Top-Left 'New' Badge */}
              <div className="absolute top-4 left-4 z-10 bg-[#1c2833] text-white px-3 py-1 rounded text-xs font-bold tracking-wider uppercase shadow">
                New
              </div>

              {/* Main Image Display */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.thumbnails[selectedImageIndex] || product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>
          </div>

          {/* Right Column: Title, Guarantee Badge, Pricing & Variant Cards */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Header Area with 30-Day Guarantee Badge on Top Right */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight uppercase">
                  {product.title.replace(' - NEW!', '')}
                </h1>
                <p className="text-neutral-600 text-sm font-medium mt-1">
                  {product.subtitle}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-xl font-extrabold text-neutral-900">$109.99</span>
                  <span className="text-neutral-400 line-through text-sm">$119.99</span>
                  <span className="bg-[#b78103] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    VIPs SAVE 8%
                  </span>
                </div>
              </div>

              {/* 30-Day Money Back Guarantee Seal Badge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-amber-600/60 rounded-full p-2 text-center bg-amber-50/40 shadow-sm">
                <div className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-bold text-amber-900 uppercase leading-tight">
                  <ShieldCheck className="w-5 h-5 text-amber-700 mb-0.5" />
                  <span>30 Day</span>
                  <span>Money Back</span>
                  <span>Guarantee</span>
                </div>
              </div>
            </div>

            {/* View FAQs */}
            <div className="mt-3 mb-5">
              <a href="#faqs" className="text-xs sm:text-sm font-semibold text-neutral-800 underline underline-offset-4 hover:text-amber-700">
                View FAQs
              </a>
            </div>

            {/* Variant Option 1: VIP Member Price (Selected Card) */}
            <div 
              onClick={() => setSelectedVariant('vip')}
              className={`border-2 rounded-2xl p-5 mb-4 cursor-pointer transition-all bg-white ${
                selectedVariant === 'vip' 
                  ? 'border-amber-600 shadow-md ring-1 ring-amber-600/20' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input 
                    type="radio" 
                    name="pricing-option" 
                    checked={selectedVariant === 'vip'} 
                    onChange={() => setSelectedVariant('vip')}
                    className="mt-1 accent-amber-600 w-4 h-4 cursor-pointer" 
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm sm:text-base text-neutral-900">THE LAWN MOWER® ULTRA GEN 6</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-neutral-800">VIP Member Price</span>
                      <span className="bg-[#b78103] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        VIPs SAVE 8%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-neutral-900">$109.99</div>
                  <div className="text-xs text-neutral-400 line-through">$119.99</div>
                </div>
              </div>

              {/* Expanded details when VIP is selected */}
              {selectedVariant === 'vip' && (
                <div className="mt-4 pt-4 border-t border-neutral-100 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-700 font-medium mb-4">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 overflow-hidden h-12">
                      <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                        className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-neutral-900 text-sm">{quantity}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                        className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                      className="flex-1 bg-[#b78103] hover:bg-[#a17102] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm sm:text-base uppercase tracking-wider"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to cart</span>
                    </button>
                  </div>

                  {/* Subscription explanation text */}
                  <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed mb-3">
                    The VIP Member Price option enrolls you in a VIP Package subscription, which includes both a fresh trimmer blade and foil blade refill, billed at $25.00 + tax every 3 months. Customize or cancel anytime.
                  </p>

                  {/* Already a member toggle */}
                  <div className="pt-2 border-t border-neutral-100">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowMemberDropdown(!showMemberDropdown); }}
                      className="flex items-center justify-between w-full text-xs font-bold text-neutral-800 hover:text-amber-700 py-1"
                    >
                      <span>Already a member?</span>
                      {showMemberDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showMemberDropdown && (
                      <div className="mt-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                        Please log in to your account to apply your existing VIP membership pricing and benefits automatically.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Variant Option 2: Regular Price Card */}
            <div 
              onClick={() => setSelectedVariant('regular')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all bg-white ${
                selectedVariant === 'regular' 
                  ? 'border-neutral-900 shadow-sm' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="pricing-option" 
                    checked={selectedVariant === 'regular'} 
                    onChange={() => setSelectedVariant('regular')}
                    className="accent-neutral-900 w-4 h-4 cursor-pointer" 
                  />
                  <span className="font-bold text-sm sm:text-base text-neutral-900">Regular Price</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-neutral-900">$119.99</div>
              </div>

              {selectedVariant === 'regular' && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
                  >
                    <span>Add to cart (Regular Price)</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
