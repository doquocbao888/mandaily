'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileText,
  HelpCircle,
  Tag
} from 'lucide-react';
import Header from '@/components/header/Header';
import SuperBanner from '@/components/header/SuperBanner';
import Footer from '@/components/header/Footer';
import { trackOrdersByQuery, type OrderItem } from '@/lib/dbService';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('id') || searchParams.get('orderId') || searchParams.get('phone') || '';

  const [query, setQuery] = useState(urlParam);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const executeSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await trackOrdersByQuery(trimmed);
      setOrders(results);
      if (results.length > 0) {
        setSelectedOrder(results[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Tracking search error:', err);
      setOrders([]);
      setSelectedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search if parameter is in URL
  useEffect(() => {
    let isMounted = true;
    if (urlParam) {
      trackOrdersByQuery(urlParam.trim()).then((results) => {
        if (isMounted) {
          setOrders(results);
          setHasSearched(true);
          if (results.length > 0) {
            setSelectedOrder(results[0]);
          } else {
            setSelectedOrder(null);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [urlParam]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearch(query);
  };

  const getStatusStep = (status: OrderItem['status']) => {
    switch (status) {
      case 'Đang xử lý':
        return 1;
      case 'Đang giao':
        return 2;
      case 'Đã giao':
        return 3;
      case 'Đã hủy':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3ED] text-neutral-900 font-sans flex flex-col">
      <SuperBanner />
      <Header />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-600 mb-6">
          <Link href="/" className="hover:text-black transition flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <span>/</span>
          <span className="text-[#9e6f1c] font-semibold">Theo dõi đơn hàng</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#c59b63]/40 text-[#8c5e1a] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Package className="w-3.5 h-3.5" />
            <span>Hệ thống tra cứu thời gian thực</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 mb-3">
            Tra Cứu Tình Trạng Đơn Hàng
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Nhập <span className="text-neutral-900 font-semibold">Mã đơn hàng</span> (ví dụ: ORD-9821) hoặc{' '}
            <span className="text-neutral-900 font-semibold">Số điện thoại</span> quý khách đã dùng khi đặt hàng.
          </p>
        </div>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto bg-white border-[1.5px] border-[#a0742f] rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-md mb-12"
        >
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Search className="w-5 h-5 text-neutral-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập chính xác Mã đơn (ví dụ: ORD-811308) hoặc SĐT 10 số..."
              className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 text-sm sm:text-base outline-none py-2 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-[#9e6f1c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Tra cứu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Order Results Display */}
        {hasSearched && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            {orders.length === 0 ? (
              <div className="bg-white border border-[#e5e2d8] rounded-2xl p-8 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-900">Không tìm thấy đơn hàng phù hợp</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Vui lòng nhập chính xác <span className="font-semibold text-neutral-900">Mã đơn hàng</span> (ví dụ: <span className="font-mono text-[#9e6f1c]">ORD-811308</span>) hoặc <span className="font-semibold text-neutral-900">Số điện thoại đầy đủ (10 số)</span> đã đặt hàng để bảo mật thông tin.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('ORD-9821');
                      executeSearch('ORD-9821');
                    }}
                    className="text-xs font-bold text-[#9e6f1c] hover:underline cursor-pointer"
                  >
                    Xem thử đơn hàng mẫu (ORD-9821)
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Multi-Order Tabs if customer has multiple orders */}
                {orders.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                    {orders.map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border cursor-pointer ${
                          selectedOrder?.id === ord.id
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-[#e5e2d8] hover:text-black'
                        }`}
                      >
                        Đơn #{ord.id} · {ord.status}
                      </button>
                    ))}
                  </div>
                )}

                {selectedOrder && (
                  <div className="bg-white border border-[#e5e2d8] rounded-3xl overflow-hidden shadow-lg">
                    {/* Header */}
                    <div className="bg-[#faf9f5] border-b border-[#e5e2d8] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
                            Đơn hàng #{selectedOrder.id}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              selectedOrder.status === 'Đã giao'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : selectedOrder.status === 'Đang giao'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : selectedOrder.status === 'Đã hủy'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {selectedOrder.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Ngày đặt: {selectedOrder.createdAt}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-neutral-500 block">Tổng thanh toán:</span>
                        <span className="text-xl font-extrabold text-[#9e6f1c]">{selectedOrder.totalPrice}</span>
                      </div>
                    </div>

                    {/* Progress Steps Timeline */}
                    <div className="p-6 sm:p-8 border-b border-[#e5e2d8] bg-[#f8f7f2]">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-6 right-6 sm:left-10 sm:right-10 h-0.5 bg-neutral-200 -z-0" />
                        <div
                          className="absolute top-5 left-6 sm:left-10 h-0.5 bg-[#9e6f1c] -z-0 transition-all duration-700"
                          style={{
                            width: `${
                              getStatusStep(selectedOrder.status) === 3
                                ? '85%'
                                : getStatusStep(selectedOrder.status) === 2
                                ? '50%'
                                : '10%'
                            }`,
                          }}
                        />

                        {/* Step Nodes */}
                        <div className="grid grid-cols-4 relative z-10 text-center">
                          {/* Step 1 */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#9e6f1c] text-white flex items-center justify-center font-bold shadow-md">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-neutral-900 mt-2">Tiếp nhận</span>
                            <span className="text-[10px] text-neutral-500 hidden sm:block">Đã vào hệ thống</span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                getStatusStep(selectedOrder.status) >= 1
                                  ? 'bg-[#9e6f1c] text-white shadow-md'
                                  : 'bg-neutral-200 text-neutral-500'
                              }`}
                            >
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-neutral-900 mt-2">Đóng gói</span>
                            <span className="text-[10px] text-neutral-500 hidden sm:block">Kiểm tra SkinSafe™</span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                getStatusStep(selectedOrder.status) >= 2
                                  ? 'bg-[#9e6f1c] text-white shadow-md'
                                  : 'bg-neutral-200 text-neutral-500'
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-neutral-900 mt-2">Vận chuyển</span>
                            <span className="text-[10px] text-neutral-500 hidden sm:block">Đang giao tận nơi</span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                getStatusStep(selectedOrder.status) >= 3
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-neutral-200 text-neutral-500'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-neutral-900 mt-2">Đã giao</span>
                            <span className="text-[10px] text-neutral-500 hidden sm:block">Giao thành công</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer & Shipping info */}
                        <div className="bg-[#faf9f5] p-4 rounded-2xl border border-[#e8e6dd] space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9e6f1c] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Thông tin nhận hàng
                          </h4>
                          <div className="text-sm space-y-1.5">
                            <p className="font-bold text-neutral-900">{selectedOrder.customerName}</p>
                            <p className="text-neutral-600 flex items-center gap-1.5 text-xs">
                              <Phone className="w-3.5 h-3.5 text-neutral-400" /> {selectedOrder.phone}
                            </p>
                            <p className="text-neutral-600 flex items-start gap-1.5 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />{' '}
                              {selectedOrder.address}
                            </p>
                          </div>
                        </div>

                        {/* Order & Payment info */}
                        <div className="bg-[#faf9f5] p-4 rounded-2xl border border-[#e8e6dd] space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9e6f1c] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Chi tiết thanh toán
                          </h4>
                          <div className="text-xs space-y-2 text-neutral-700">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Hình thức:</span>
                              <span className="font-bold text-neutral-900">{selectedOrder.variant || 'Thanh toán COD'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Số lượng sản phẩm:</span>
                              <span className="font-bold text-neutral-900">{selectedOrder.quantity} món</span>
                            </div>
                            {selectedOrder.discountCode && (
                              <div className="flex justify-between text-emerald-700 font-semibold">
                                <span className="flex items-center gap-1">
                                  <Tag className="w-3 h-3" /> Voucher ({selectedOrder.discountCode}):
                                </span>
                                <span>{selectedOrder.discountAmount || '-10%'}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-[#e8e6dd] font-bold text-sm">
                              <span className="text-neutral-900">Tổng cộng:</span>
                              <span className="text-[#9e6f1c]">{selectedOrder.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Purchased Product Overview */}
                      <div className="bg-[#faf9f5] p-4 rounded-2xl border border-[#e8e6dd]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Sản phẩm trong đơn
                        </h4>
                        <p className="text-sm font-semibold text-neutral-900 leading-relaxed">
                          {selectedOrder.productName}
                        </p>
                      </div>

                      {/* Manscaped Guarantees */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs text-neutral-600">
                        <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-[#e8e6dd] shadow-2xs">
                          <ShieldCheck className="w-4 h-4 text-[#9e6f1c]" />
                          <span className="font-medium">Bảo hành chính hãng 2 năm</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-[#e8e6dd] shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-[#9e6f1c]" />
                          <span className="font-medium">Cam kết hoàn tiền 30 ngày</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-[#e8e6dd] shadow-2xs">
                          <Truck className="w-4 h-4 text-[#9e6f1c]" />
                          <span className="font-medium">Giao hàng kín đáo, bảo mật</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Customer Support CTA */}
        <div className="mt-16 bg-white border border-[#e5e2d8] rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm space-y-4">
          <HelpCircle className="w-8 h-8 text-[#9e6f1c] mx-auto" />
          <h3 className="text-lg font-bold uppercase tracking-wide text-neutral-900">Cần trợ giúp về đơn hàng?</h3>
          <p className="text-xs sm:text-sm text-neutral-600">
            Đội ngũ chuyên viên chăm sóc khách hàng Manscaped sẵn sàng giải đáp và xử lý đơn hàng 24/7.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:19008888"
              className="px-6 py-2.5 rounded-xl bg-black text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#9e6f1c] transition shadow-xs"
            >
              Hotline: 1900 8888
            </a>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-[#eae8e1] text-neutral-900 font-bold text-xs uppercase tracking-wider hover:bg-[#dedcd3] transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F3ED] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#9e6f1c] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
