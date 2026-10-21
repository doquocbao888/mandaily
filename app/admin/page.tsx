'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Lock, 
  User, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  ShieldCheck,
  Search,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { featuredProductsConfig, type ProductItem } from '@/config/products';

interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productName: string;
  variant: string;
  quantity: number;
  totalPrice: string;
  status: 'Đang xử lý' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
  createdAt: string;
}

const initialOrders: OrderItem[] = [
  {
    id: 'ORD-9821',
    customerName: 'Đỗ Quốc Bảo',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    productName: 'The Lawn Mower® Ultra Gen 6',
    variant: 'VIP Member Price',
    quantity: 1,
    totalPrice: '$109.99',
    status: 'Đang xử lý',
    createdAt: '2026-10-21 14:30',
  },
  {
    id: 'ORD-9820',
    customerName: 'Nguyễn Văn Minh',
    phone: '0988888888',
    address: '45 Lê Duẩn, Ba Đình, Hà Nội',
    productName: 'The Performance Package Ultra Gen 6',
    variant: 'Standard Kit',
    quantity: 1,
    totalPrice: '$159.99',
    status: 'Đã giao',
    createdAt: '2026-10-20 10:15',
  },
  {
    id: 'ORD-9819',
    customerName: 'Trần Hoàng Long',
    phone: '0912345678',
    address: '78 Hai Bà Trưng, Đà Nẵng',
    productName: 'The Lawn Mower® Ultra Gen 6',
    variant: 'Regular Price',
    quantity: 2,
    totalPrice: '$239.98',
    status: 'Đang giao',
    createdAt: '2026-10-19 18:45',
  },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  
  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  
  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchOrder, setSearchOrder] = useState('');

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newVipPrice, setNewVipPrice] = useState('$109.99');
  const [newRegularPrice, setNewRegularPrice] = useState('$119.99');
  const [newImageSrc, setNewImageSrc] = useState('/assets/aistudio/30-00006-NA_f201a618.png');
  const [newThumbnailsText, setNewThumbnailsText] = useState('/assets/aistudio/30-00006-NA_f201a618.png\n/assets/aistudio/25aaeee852d4_1a4c043f.webp\n/assets/aistudio/b72c1da980f6_e399d627.webp');

  // Edit Product Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editThumbnailsText, setEditThumbnailsText] = useState('');

  useEffect(() => {
    const logged = localStorage.getItem('manscaped_admin_auth');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
    setProducts(featuredProductsConfig.products);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'doquocbao') {
      setIsLoggedIn(true);
      localStorage.setItem('manscaped_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác! (id: admin, pass: doquocbao)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('manscaped_admin_auth');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const parsedThumbnails = newThumbnailsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || 'Groin & Body Hair Trimmer',
      categoryPath: ['Trang chủ', 'PRODUCTS', newTitle],
      vipPrice: newVipPrice,
      regularPrice: newRegularPrice,
      href: `/products/prod-${Date.now()}`,
      imageSrc: newImageSrc || parsedThumbnails[0] || '/assets/aistudio/30-00006-NA_f201a618.png',
      imageAlt: newTitle,
      thumbnails: parsedThumbnails.length > 0 ? parsedThumbnails : [newImageSrc],
      badge: 'QUÀ TẶNG ĐỘC QUYỀN TRÊN WEBSITE',
      rating: 5.0,
      reviewCount: '1,671 đánh giá',
      soldCount: 'Đã bán 75.8k',
      salesBadge: 'Best Seller',
      shortDescription: newSubtitle || 'Máy cạo lông vùng kín chuyên dụng cao cấp, chống nước IPX7.',
      highlights: ['Sạch chỉ 1 lần lướt', 'Không đau, không xước (SkinSafe™)', 'Da mịn, không ngứa rát'],
      reviewSample: { author: 'Chi Hùng', rating: 5, comment: 'Sản phẩm tuyệt vời, dùng rất mượt.' },
      variants: [
        { id: 'v1', name: newTitle, price: newVipPrice, originalPrice: newRegularPrice, badge: 'Gọn nhẹ' }
      ],
      gifts: ['Tặng kèm Dung Dịch Vệ Sinh 150ml'],
      cashbackText: 'Được hoàn lên đến 56.000 SpotCredit',
      warrantyText: 'BẢO HÀNH 12 THÁNG 1 ĐỔI 1'
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct({ ...product });
    setEditThumbnailsText(product.thumbnails.join('\n'));
    setShowEditModal(true);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsedThumbnails = editThumbnailsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updated = {
      ...editingProduct,
      thumbnails: parsedThumbnails.length > 0 ? parsedThumbnails : [editingProduct.imageSrc]
    };

    setProducts(products.map(p => p.id === updated.id ? updated : p));
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MANSCAPED ADMIN</h1>
            <p className="text-xs text-neutral-400 mt-1">Đăng nhập hệ thống quản trị nội bộ</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Tên đăng nhập (ID)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-[#262626] border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Mật khẩu (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="doquocbao"
                  required
                  className="w-full bg-[#262626] border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/20 text-sm uppercase tracking-wider"
            >
              Đăng nhập Quản trị
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Gợi ý: id: <span className="text-amber-400 font-bold">admin</span> / pass: <span className="text-amber-400 font-bold">doquocbao</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3ee] text-neutral-900 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-lg">M</div>
            <div>
              <span className="font-bold text-sm tracking-wide block">MANSCAPED</span>
              <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-widest">Admin Portal</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-amber-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tổng quan (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'products' ? 'bg-amber-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Quản lý Sản phẩm</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-amber-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Quản lý Đơn hàng</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <Link
            href="/"
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all mb-2"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trang chủ Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-neutral-900">
              {activeTab === 'overview' && 'Bảng điều khiển tổng quan'}
              {activeTab === 'products' && 'Quản lý danh mục sản phẩm'}
              {activeTab === 'orders' && 'Quản lý danh sách đơn hàng'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow">
              A
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-neutral-900 block">Administrator</span>
              <span className="text-[10px] text-neutral-500">admin (doquocbao)</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tổng doanh thu</p>
                    <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">$12,480.00</h3>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+14.2% tháng này</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tổng đơn hàng</p>
                    <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">{orders.length + 142}</h3>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+8 đơn mới hôm nay</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sản phẩm đang bán</p>
                    <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">{products.length}</h3>
                    <span className="text-xs text-neutral-500 font-semibold mt-1 inline-block">Đã cập nhật đầy đủ</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Khách hàng VIP</p>
                    <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">1,284</h3>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Tỷ lệ giữ chân 94%</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <User className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-neutral-900">Đơn hàng mới nhất</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-amber-700 hover:underline">
                    Xem tất cả đơn hàng →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 text-xs text-neutral-500 uppercase">
                        <th className="pb-3 font-semibold">Mã đơn</th>
                        <th className="pb-3 font-semibold">Khách hàng</th>
                        <th className="pb-3 font-semibold">Sản phẩm</th>
                        <th className="pb-3 font-semibold">Tổng tiền</th>
                        <th className="pb-3 font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50">
                          <td className="py-3 font-bold text-neutral-900">{order.id}</td>
                          <td className="py-3 text-neutral-700">{order.customerName}</td>
                          <td className="py-3 text-neutral-600">{order.productName}</td>
                          <td className="py-3 font-semibold text-amber-700">{order.totalPrice}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm sản phẩm mới</span>
                </button>
              </div>

              {/* Product List Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase">
                    <tr>
                      <th className="p-4 font-semibold">Ảnh chính & phụ</th>
                      <th className="p-4 font-semibold">Tên sản phẩm</th>
                      <th className="p-4 font-semibold">Mô tả / Subtitle</th>
                      <th className="p-4 font-semibold">Giá VIP</th>
                      <th className="p-4 font-semibold">Giá Thường</th>
                      <th className="p-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products
                      .filter(p => p.title.toLowerCase().includes(searchProduct.toLowerCase()))
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/80">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden border flex-shrink-0">
                                <Image
                                  src={p.imageSrc}
                                  alt={p.imageAlt}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="text-xs text-neutral-500 font-medium">
                                ({p.thumbnails?.length || 1} ảnh)
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-neutral-900">{p.title}</td>
                          <td className="p-4 text-neutral-600 text-xs max-w-xs truncate">{p.subtitle}</td>
                          <td className="p-4 font-semibold text-amber-700">{p.vipPrice}</td>
                          <td className="p-4 text-neutral-700">{p.regularPrice}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-block"
                              title="Sửa thông tin chi tiết sản phẩm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors inline-block"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="Tìm kiếm mã đơn hoặc tên khách..."
                    className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Order List Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase">
                    <tr>
                      <th className="p-4 font-semibold">Mã đơn</th>
                      <th className="p-4 font-semibold">Khách hàng</th>
                      <th className="p-4 font-semibold">Sản phẩm đặt</th>
                      <th className="p-4 font-semibold">Tổng tiền</th>
                      <th className="p-4 font-semibold">Trạng thái</th>
                      <th className="p-4 font-semibold text-right">Cập nhật trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders
                      .filter(o => o.customerName.toLowerCase().includes(searchOrder.toLowerCase()) || o.id.toLowerCase().includes(searchOrder.toLowerCase()))
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/80">
                          <td className="p-4 font-bold text-neutral-900">{order.id}</td>
                          <td className="p-4">
                            <span className="font-semibold text-neutral-900 block">{order.customerName}</span>
                            <span className="text-xs text-neutral-500">{order.phone} • {order.address}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-neutral-800 block">{order.productName}</span>
                            <span className="text-xs text-neutral-500">{order.variant} (SL: {order.quantity})</span>
                          </td>
                          <td className="p-4 font-bold text-amber-700">{order.totalPrice}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                              order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              order.status === 'Đã hủy' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderItem['status'])}
                              className="bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-amber-600"
                            >
                              <option value="Đang xử lý">Đang xử lý</option>
                              <option value="Đang giao">Đang giao</option>
                              <option value="Đã giao">Đã giao</option>
                              <option value="Đã hủy">Đã hủy</option>
                            </select>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-neutral-900">Thêm sản phẩm mới (Đầy đủ thông tin)</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: The Lawn Mower Ultra Gen 6"
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mô tả / Subtitle</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Ví dụ: Ultimate Ball & Body Hair Trimmer"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá VIP</label>
                  <input
                    type="text"
                    value={newVipPrice}
                    onChange={(e) => setNewVipPrice(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá Thường</label>
                  <input
                    type="text"
                    value={newRegularPrice}
                    onChange={(e) => setNewRegularPrice(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Ảnh chính (Main Image URL / Path)</label>
                <input
                  type="text"
                  value={newImageSrc}
                  onChange={(e) => setNewImageSrc(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ảnh phụ & Ảnh đặc tả (Thumbnails) - Mỗi đường dẫn một dòng
                </label>
                <textarea
                  value={newThumbnailsText}
                  onChange={(e) => setNewThumbnailsText(e.target.value)}
                  rows={5}
                  placeholder="/assets/aistudio/image_1.webp&#10;/assets/aistudio/image_2.webp"
                  className="w-full border border-neutral-300 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-amber-600"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Nhập các đường dẫn ảnh phụ để hiển thị trong cột thumbnail bên trái trang chi tiết sản phẩm.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-bold hover:bg-neutral-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow"
                >
                  Thêm sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-neutral-900">Sửa thông tin chi tiết sản phẩm</h3>
              <button onClick={() => setShowEditModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mô tả / Subtitle</label>
                <input
                  type="text"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá VIP</label>
                  <input
                    type="text"
                    value={editingProduct.vipPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, vipPrice: e.target.value })}
                    required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá Thường</label>
                  <input
                    type="text"
                    value={editingProduct.regularPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: e.target.value })}
                    required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Ảnh chính (Main Image URL / Path)</label>
                <input
                  type="text"
                  value={editingProduct.imageSrc}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageSrc: e.target.value })}
                  required
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ảnh phụ & Ảnh đặc tả (Thumbnails) - Mỗi đường dẫn một dòng
                </label>
                <textarea
                  value={editThumbnailsText}
                  onChange={(e) => setEditThumbnailsText(e.target.value)}
                  rows={5}
                  placeholder="/assets/aistudio/image_1.webp&#10;/assets/aistudio/image_2.webp"
                  className="w-full border border-neutral-300 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-amber-600"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Nhập danh sách đường dẫn ảnh phụ để hiển thị trong cột thumbnail trên trang chi tiết sản phẩm.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-bold hover:bg-neutral-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
