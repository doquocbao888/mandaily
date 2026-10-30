'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useSyncExternalStore } from 'react';
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
  Image as ImageIcon,
  RotateCcw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Film,
  Upload,
  ExternalLink,
  Globe
} from 'lucide-react';
import { featuredProductsConfig, type ProductItem, type VideoReviewItem, type PackageItem } from '@/config/products';
import MediaManager from '@/components/admin/MediaManager';
import ProductImagePicker from '@/components/admin/ProductImagePicker';
import { formatVND, getProductPrices } from '@/lib/formatters';
import { 
  subscribeProducts, 
  subscribeOrders, 
  subscribeMedia,
  saveProductToDb, 
  deleteProductFromDb, 
  updateOrderStatusInDb, 
  deleteOrderFromDb,
  updateProductOrderInDb,
  seedInitialProductsIfNeeded, 
  seedInitialOrdersIfNeeded,
  seedInitialMediaIfNeeded,
  restoreDefaultProducts,
  type OrderItem,
  type MediaItem
} from '@/lib/dbService';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = typeof window !== 'undefined' && localStorage.getItem('manscaped_admin_auth') === 'true';
      setIsAuthenticated(isAuth);
    };

    const timer = setTimeout(() => {
      checkAuth();
      setMounted(true);
    }, 0);

    window.addEventListener('storage', checkAuth);
    window.addEventListener('manscaped_auth_change', checkAuth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('manscaped_auth_change', checkAuth);
    };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'media'>('overview');
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  
  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchOrder, setSearchOrder] = useState('');

  // Media state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newHref, setNewHref] = useState('');
  const [newCategory, setNewCategory] = useState('deals');
  const [newCategories, setNewCategories] = useState<string[]>(['deals']);

  const toggleNewCategory = (catId: string) => {
    if (newCategories.includes(catId)) {
      if (newCategories.length > 1) {
        setNewCategories(newCategories.filter(c => c !== catId));
      }
    } else {
      setNewCategories([...newCategories, catId]);
    }
  };

  const toggleEditCategory = (catId: string) => {
    if (!editingProduct) return;
    const rawCat = editingProduct.category || 'deals';
    const currentCats = rawCat.split(',').map(s => s.trim()).filter(Boolean);
    let updated: string[];
    if (currentCats.includes(catId)) {
      if (currentCats.length > 1) {
        updated = currentCats.filter(c => c !== catId);
      } else {
        updated = currentCats;
      }
    } else {
      updated = [...currentCats, catId];
    }
    setEditingProduct({
      ...editingProduct,
      category: updated.join(','),
      categories: updated,
    });
  };
  const [newVipPrice, setNewVipPrice] = useState('450.000đ');
  const [newRegularPrice, setNewRegularPrice] = useState('500.000đ');
  const [newDetailedDescription, setNewDetailedDescription] = useState('');
  const [newImageSrc, setNewImageSrc] = useState('/assets/aistudio/30-00006-NA_f201a618.png');
  const [newThumbnailsText, setNewThumbnailsText] = useState('/assets/aistudio/30-00006-NA_f201a618.png\n/assets/aistudio/25aaeee852d4_1a4c043f.webp\n/assets/aistudio/b72c1da980f6_e399d627.webp');

  // Edit Product Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editThumbnailsText, setEditThumbnailsText] = useState('');

  // Delete & Confirmation States
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [isRestoringDefaults, setIsRestoringDefaults] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    let isMounted = true;
    // Seed initial data if Firestore is empty
    seedInitialProductsIfNeeded().catch(() => {});
    seedInitialOrdersIfNeeded().catch(() => {});
    seedInitialMediaIfNeeded().catch(() => {});

    // Subscribe to real-time products
    const unsubProducts = subscribeProducts((items) => {
      if (isMounted) setProducts(items);
    });

    // Subscribe to real-time orders
    const unsubOrders = subscribeOrders((items) => {
      if (isMounted) {
        setOrders(items || []);
      }
    });

    // Subscribe to real-time media
    const unsubMedia = subscribeMedia((items) => {
      if (isMounted) setMediaList(items);
    });

    const handleOrderCreated = (e: any) => {
      const newOrd = e?.detail;
      if (newOrd && isMounted) {
        setOrders((prev) => {
          if (prev.some((o) => o.id === newOrd.id)) return prev;
          return [newOrd, ...prev];
        });
      }
    };
    window.addEventListener('manscaped_order_created', handleOrderCreated);

    return () => {
      isMounted = false;
      window.removeEventListener('manscaped_order_created', handleOrderCreated);
      try {
        unsubProducts();
      } catch {
        // ignore
      }
      try {
        unsubOrders();
      } catch {
        // ignore
      }
      try {
        unsubMedia();
      } catch {
        // ignore
      }
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'doquocbao') {
      localStorage.setItem('manscaped_admin_auth', 'true');
      setIsAuthenticated(true);
      window.dispatchEvent(new Event('manscaped_auth_change'));
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác! (id: admin, pass: doquocbao)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('manscaped_admin_auth');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('manscaped_auth_change'));
  };

  const handleClearCache = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bộ nhớ cache (localStorage & trạng thái tạm)?')) {
      try {
        const auth = localStorage.getItem('manscaped_admin_auth');
        localStorage.clear();
        if (auth) {
          localStorage.setItem('manscaped_admin_auth', auth);
        }
        setToastMessage({ text: 'Đã xóa bộ nhớ cache thành công! Đang tải lại trang...' });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch {
        setToastMessage({ text: 'Lỗi khi xóa cache.', isError: true });
      }
    }
  };

  const executeDeleteProduct = async () => {
    if (!productToDelete) return;
    const target = productToDelete;
    setIsDeletingProduct(true);
    try {
      // Optimistically update local state so table updates immediately
      setProducts(prev => prev.filter(p => p.id !== target.id));
      await deleteProductFromDb(target.id);
      showToast(`Đã xóa vĩnh viễn sản phẩm "${target.title}" thành công!`);
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      showToast(err?.message || 'Không thể xóa sản phẩm khỏi cơ sở dữ liệu.', true);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleRestoreDefaultProducts = async () => {
    setIsRestoringDefaults(true);
    try {
      await restoreDefaultProducts();
      showToast('Đã khôi phục thành công 5 sản phẩm danh mục gốc!');
    } catch (err: any) {
      console.error('Lỗi khi khôi phục sản phẩm gốc:', err);
      showToast('Không thể khôi phục sản phẩm gốc.', true);
    } finally {
      setIsRestoringDefaults(false);
    }
  };

  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const handleMoveProduct = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    // Create a new array with items swapped
    const reordered = [...products];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Update orderIndex sequentially
    const updatedWithIndex = reordered.map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));

    // Optimistic UI update
    setProducts(updatedWithIndex);
    setIsUpdatingOrder(true);

    try {
      await updateProductOrderInDb(
        updatedWithIndex.map((p, idx) => ({ id: p.id, orderIndex: idx }))
      );
      showToast(`Đã chuyển sản phẩm "${movedItem.title}" sang vị trí #${targetIndex + 1}!`);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật thứ tự sản phẩm:', err);
      showToast('Lỗi khi lưu thứ tự sản phẩm.', true);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const parsedThumbnails = newThumbnailsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const slug = newHref.trim().replace(/^\/products\//, '').replace(/^\/+/, '');
    const prodId = slug || `prod-${Date.now()}`;
    const finalHref = `/products/${prodId}`;

    const catStr = newCategories.join(',');
    const newProd: ProductItem = {
      id: prodId,
      orderIndex: products.length,
      title: newTitle,
      subtitle: newSubtitle || 'Groin & Body Hair Trimmer',
      category: catStr,
      categories: newCategories,
      categoryPath: ['Trang chủ', newCategories.includes('deals') ? 'ƯU ĐÃI & COMBO' : newCategories.includes('groin') ? 'CHĂM SÓC VÙNG KÍN' : newCategories.includes('beard') ? 'RÂU & MẶT' : 'TÓC & TOÀN THÂN', newTitle],
      vipPrice: newVipPrice,
      regularPrice: newRegularPrice,
      href: finalHref,
      imageSrc: newImageSrc || parsedThumbnails[0] || '/assets/aistudio/30-00006-NA_f201a618.png',
      imageAlt: newTitle,
      thumbnails: parsedThumbnails.length > 0 ? parsedThumbnails : [newImageSrc],
      badge: '',
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
      warrantyText: 'BẢO HÀNH CHÍNH HÃNG 2 NĂM 1 ĐỔI 1',
      detailedDescription: newDetailedDescription
    };

    try {
      await saveProductToDb(newProd);
      setShowAddProductModal(false);
      setNewTitle('');
      setNewSubtitle('');
      setNewHref('');
      setNewCategories(['deals']);
      setNewDetailedDescription('');
      showToast(`Đã thêm mới sản phẩm "${newProd.title}" thành công!`);
    } catch (err: any) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      showToast(err?.message || 'Lỗi khi thêm sản phẩm.', true);
    }
  };

  const handleOpenEditModal = (product: ProductItem) => {
    const curIndex = products.findIndex(p => p.id === product.id);
    const defaultReviews: VideoReviewItem[] = [
      {
        id: 'review-1',
        handle: 'pierredalati',
        name: 'Pierre Dalati',
        compactPoster: '/assets/aistudio/review_pierre_compact.png',
        largePoster: '/assets/aistudio/review_pierredalati.png',
        videoUrl: 'https://www.youtube.com/shorts/9bZkp7q19f0',
        quote: 'The Lawn Mower 6.0 chắc chắn là tông đơ đỉnh nhất tôi từng dùng. Không hề kéo rứt lông, cực kỳ êm ái trên vùng da nhạy cảm.'
      },
      {
        id: 'review-2',
        handle: 'blaiseffrench',
        name: 'Blaise Ffrench',
        compactPoster: '/assets/aistudio/review_blaiseffrench.png',
        largePoster: '/assets/aistudio/review_blaise_large.png',
        videoUrl: 'https://www.youtube.com/shorts/3JZ_D3ELwOQ',
        quote: 'Thiết kế công thái học và pin xuất sắc. Cầm trên tay mang lại cảm giác sang trọng, đẳng cấp phái mạnh.'
      },
      {
        id: 'review-3',
        handle: 'caleighmackenzie',
        name: 'Caleigh Mackenzie',
        compactPoster: '/assets/aistudio/review_caleighmackenzie.png',
        largePoster: '/assets/aistudio/review_caleigh_large.png',
        videoUrl: 'https://www.youtube.com/shorts/jfKfPfyJRdk',
        quote: 'Quà tặng hoàn hảo cho chàng! Máy chống nước 100%, chạy siêu êm và cạo rất sạch sẽ.'
      }
    ];

    const defaultPackageItems: PackageItem[] = [
      {
        id: 'pkg-1',
        name: product.title.replace(' - NEW!', ''),
        subtitle: 'Thân máy chính SkinSafe™',
        imageSrc: product.thumbnails[0] || product.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png',
        isGift: false,
        description: 'Tông đơ cắt tỉa chuyên dụng cao cấp, chống nước 100% IPX7.'
      },
      {
        id: 'pkg-2',
        name: 'Đế sạc & Cáp USB-C',
        subtitle: 'Sạc nhanh thông minh',
        imageSrc: product.thumbnails[1] || product.imageSrc || '/assets/aistudio/25aaeee852d4_1a4c043f.webp',
        isGift: false,
        description: 'Chân đế sạc không dây cao cấp kết hợp cáp sạc nhanh chuẩn USB-C.'
      },
      {
        id: 'pkg-3',
        name: 'Lược căn độ dài',
        subtitle: 'Khóa an toàn SkinSafe™',
        imageSrc: product.thumbnails[2] || product.imageSrc || '/assets/aistudio/b72c1da980f6_e399d627.webp',
        isGift: false,
        description: 'Bộ cữ định hình đa nấc tùy chỉnh độ dài cắt tỉa linh hoạt.'
      },
      {
        id: 'pkg-4',
        name: 'Chổi & Dầu tra lưỡi',
        subtitle: 'Bộ bảo dưỡng máy',
        imageSrc: product.thumbnails[3] || product.imageSrc || '/assets/aistudio/e25de805d015_f449fce7.webp',
        isGift: false,
        description: 'Dụng cụ vệ sinh và dầu bôi trơn giữ cho lưỡi máy luôn sắc bén.'
      }
    ];

    const packageItems = (product.packageIncludes && product.packageIncludes.length > 0)
      ? product.packageIncludes
      : defaultPackageItems;

    setEditingProduct({ 
      ...product,
      orderIndex: typeof product.orderIndex === 'number' ? product.orderIndex : curIndex,
      packageIncludes: packageItems,
      videoReviews: (product.videoReviews && product.videoReviews.length > 0) ? product.videoReviews : defaultReviews
    });
    setEditThumbnailsText(product.thumbnails.join('\n'));
    setShowEditModal(true);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsedThumbnails = editThumbnailsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const cleanSlug = (editingProduct.href || '').trim().replace(/^\/products\//, '').replace(/^\/+/, '');
    const finalHref = cleanSlug ? `/products/${cleanSlug}` : (editingProduct.href || `/products/${editingProduct.id}`);

    const cat = editingProduct.category || 'deals';
    const catArray = cat.split(',').map(s => s.trim()).filter(Boolean);
    const updated: ProductItem = {
      ...editingProduct,
      category: cat,
      categories: catArray,
      categoryPath: ['Trang chủ', catArray.includes('deals') ? 'ƯU ĐÃI & COMBO' : catArray.includes('groin') ? 'CHĂM SÓC VÙNG KÍN' : catArray.includes('beard') ? 'RÂU & MẶT' : 'TÓC & TOÀN THÂN', editingProduct.title],
      href: finalHref,
      thumbnails: parsedThumbnails.length > 0 ? parsedThumbnails : [editingProduct.imageSrc]
    };

    try {
      // Re-order if position was changed in modal
      const oldIndex = products.findIndex(p => p.id === updated.id);
      const targetOrder = typeof updated.orderIndex === 'number'
        ? Math.max(0, Math.min(updated.orderIndex, products.length - 1))
        : (oldIndex >= 0 ? oldIndex : products.length - 1);

      const otherProducts = products.filter(p => p.id !== updated.id);
      otherProducts.splice(targetOrder, 0, updated);
      const reordered = otherProducts.map((p, idx) => ({ ...p, orderIndex: idx }));

      setProducts(reordered);
      await saveProductToDb(updated);
      await updateProductOrderInDb(reordered.map((p, idx) => ({ id: p.id, orderIndex: idx })));

      setShowEditModal(false);
      setEditingProduct(null);
      showToast(`Đã cập nhật sản phẩm "${updated.title}" thành công!`);
    } catch (err: any) {
      console.error('Lỗi khi sửa sản phẩm:', err);
      showToast(err?.message || 'Lỗi khi cập nhật sản phẩm.', true);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderItem['status']) => {
    try {
      await updateOrderStatusInDb(orderId, newStatus);
      showToast(`Đã cập nhật trạng thái đơn ${orderId} thành "${newStatus}"!`);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
      showToast(err?.message || 'Lỗi cập nhật trạng thái.', true);
    }
  };

  const executeDeleteOrder = async () => {
    if (!orderToDelete) return;
    const target = orderToDelete;
    setIsDeletingOrder(true);
    try {
      setOrders((prev) => prev.filter((o) => o.id !== target.id));
      await deleteOrderFromDb(target.id);
      showToast(`Đã xóa vĩnh viễn đơn hàng "${target.id}" thành công!`);
      setOrderToDelete(null);
    } catch (err: any) {
      console.error('Lỗi khi xóa đơn hàng:', err);
      showToast(err?.message || 'Không thể xóa đơn hàng khỏi cơ sở dữ liệu.', true);
    } finally {
      setIsDeletingOrder(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-2xl p-8 text-white flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-400">Đang khởi tạo hệ thống quản trị...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1c1c] border border-neutral-800 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MANFRESH ADMIN</h1>
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
              <span className="font-bold text-sm tracking-wide block">MANFRESH</span>
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

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'media' ? 'bg-amber-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Quản lý Media (Ảnh & Video)</span>
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
              {activeTab === 'media' && 'Thư viện Quản lý Media (Hình ảnh & Video)'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Xóa toàn bộ Cache & LocalStorage"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Xóa Cache</span>
            </button>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đã kết nối Hostinger MySQL (u762924426_manfresh_db)</span>
            </div>
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
              {/* Time Filter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
                <div>
                  <h3 className="font-bold text-base text-neutral-900">Báo cáo tổng quan hoạt động</h3>
                  <p className="text-xs text-neutral-500">Số liệu được cập nhật tự động từ cơ sở dữ liệu thực tế.</p>
                </div>
                <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                  {[
                    { id: 'day', label: 'Hôm nay' },
                    { id: 'week', label: 'Tuần này' },
                    { id: 'month', label: 'Tháng này' },
                    { id: 'quarter', label: 'Quý này' },
                    { id: 'year', label: 'Năm nay' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTimeFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timeFilter === tab.id
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Cards with 100% Real Synchronized Data */}
              {(() => {
                const now = new Date();

                // Helper to parse dates from various formats
                const parseOrderDate = (order: OrderItem): Date | null => {
                  const dateStr = order.createdAt;
                  if (!dateStr || typeof dateStr !== 'string') return null;

                  // 1. Direct standard Date string / ISO
                  const direct = new Date(dateStr);
                  if (!isNaN(direct.getTime())) return direct;

                  // 2. Format DD/MM/YYYY or DD-MM-YYYY (Vietnamese standard)
                  const dmy = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
                  if (dmy) {
                    const day = parseInt(dmy[1], 10);
                    const month = parseInt(dmy[2], 10) - 1;
                    const year = parseInt(dmy[3], 10);
                    const timeMatch = dateStr.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
                    const h = timeMatch ? parseInt(timeMatch[1], 10) : 0;
                    const m = timeMatch ? parseInt(timeMatch[2], 10) : 0;
                    const s = timeMatch && timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
                    return new Date(year, month, day, h, m, s);
                  }

                  // 3. Format YYYY-MM-DD or YYYY/MM/DD
                  const ymd = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
                  if (ymd) {
                    const year = parseInt(ymd[1], 10);
                    const month = parseInt(ymd[2], 10) - 1;
                    const day = parseInt(ymd[3], 10);
                    const timeMatch = dateStr.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
                    const h = timeMatch ? parseInt(timeMatch[1], 10) : 0;
                    const m = timeMatch ? parseInt(timeMatch[2], 10) : 0;
                    const s = timeMatch && timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
                    return new Date(year, month, day, h, m, s);
                  }

                  return null;
                };

                // Filter real orders based on selected time frame
                const filteredOrders = orders.filter((order) => {
                  const d = parseOrderDate(order);
                  // If order has no valid date, include it so real orders are never lost
                  if (!d) return true;

                  if (timeFilter === 'day') {
                    return (
                      d.getFullYear() === now.getFullYear() &&
                      d.getMonth() === now.getMonth() &&
                      d.getDate() === now.getDate()
                    );
                  }

                  if (timeFilter === 'week') {
                    const startOfWeek = new Date(now);
                    const dayOfWeek = startOfWeek.getDay();
                    const distanceToMonday = (dayOfWeek + 6) % 7;
                    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);
                    startOfWeek.setHours(0, 0, 0, 0);

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 7);

                    return d >= startOfWeek && d < endOfWeek;
                  }

                  if (timeFilter === 'month') {
                    return (
                      d.getFullYear() === now.getFullYear() &&
                      d.getMonth() === now.getMonth()
                    );
                  }

                  if (timeFilter === 'quarter') {
                    const currentQuarter = Math.floor(now.getMonth() / 3);
                    const orderQuarter = Math.floor(d.getMonth() / 3);
                    return d.getFullYear() === now.getFullYear() && orderQuarter === currentQuarter;
                  }

                  if (timeFilter === 'year') {
                    return d.getFullYear() === now.getFullYear();
                  }

                  return true;
                });

                // Calculate real revenue from valid (non-cancelled) filtered orders
                const validRevenueOrders = filteredOrders.filter((o) => o.status !== 'Đã hủy');
                const totalRevenue = validRevenueOrders.reduce((sum, o) => {
                  const rawNum = parseFloat(String(o.totalPrice || '').replace(/[^0-9.]/g, '')) || 0;
                  return sum + rawNum;
                }, 0);

                // Calculate real order counts
                const totalOrdersCount = filteredOrders.length;
                const pendingOrdersCount = filteredOrders.filter((o) => o.status === 'Đang xử lý').length;
                const deliveredOrdersCount = filteredOrders.filter((o) => o.status === 'Đã giao').length;

                // Calculate real unique customers from actual orders
                const uniqueCustomerKeys = new Set(
                  filteredOrders
                    .map((o) => (o.phone || o.customerName || '').trim())
                    .filter(Boolean)
                );
                const customersCount = uniqueCustomerKeys.size;

                const timeLabels: Record<typeof timeFilter, string> = {
                  day: 'hôm nay',
                  week: 'tuần này',
                  month: 'tháng này',
                  quarter: 'quý này',
                  year: 'năm nay',
                };
                const currentPeriodLabel = timeLabels[timeFilter];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tổng doanh thu</p>
                        <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">
                          {formatVND(totalRevenue)}
                        </h3>
                        {totalRevenue > 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                            Từ {validRevenueOrders.length} đơn hàng {currentPeriodLabel}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium mt-1 inline-block">
                            Chưa có doanh thu ({currentPeriodLabel})
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tổng đơn hàng</p>
                        <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">{totalOrdersCount}</h3>
                        {totalOrdersCount > 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                            {pendingOrdersCount} chờ xử lý · {deliveredOrdersCount} đã giao
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium mt-1 inline-block">
                            0 đơn phát sinh ({currentPeriodLabel})
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sản phẩm đang bán</p>
                        <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">{products.length}</h3>
                        <span className="text-xs text-neutral-500 font-semibold mt-1 inline-block">
                          Đã đồng bộ realtime ({products.length} SP)
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Khách hàng đã mua</p>
                        <h3 className="text-2xl font-extrabold text-neutral-900 mt-1">{customersCount}</h3>
                        {customersCount > 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                            {customersCount} khách hàng riêng biệt
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium mt-1 inline-block">
                            Chưa có khách đặt hàng ({currentPeriodLabel})
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <User className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                );
              })()}

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
                        <th className="pb-3 font-semibold">Thời gian đặt</th>
                        <th className="pb-3 font-semibold">Khách hàng</th>
                        <th className="pb-3 font-semibold">Sản phẩm</th>
                        <th className="pb-3 font-semibold">Tổng tiền</th>
                        <th className="pb-3 font-semibold">Trạng thái</th>
                        <th className="pb-3 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-xs text-neutral-400">
                            Chưa có đơn hàng nào
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-50">
                            <td className="py-3 font-bold text-neutral-900 font-mono text-xs">{order.id}</td>
                            <td className="py-3 whitespace-nowrap text-xs text-neutral-600">
                              <span className="inline-flex items-center space-x-1 text-neutral-700 font-medium bg-neutral-100 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3 text-amber-600 inline" />
                                <span>{order.createdAt || 'Mới đặt'}</span>
                              </span>
                            </td>
                            <td className="py-3 text-neutral-700">{order.customerName}</td>
                            <td className="py-3 text-neutral-600">{order.productName}</td>
                            <td className="py-3 font-semibold text-amber-700">{formatVND(order.totalPrice)}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                order.status === 'Đã giao' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                order.status === 'Đã hủy' ? 'bg-red-50 text-red-700 border border-red-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                type="button"
                                onClick={() => setOrderToDelete(order)}
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                                title="Xóa vĩnh viễn đơn hàng này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
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

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm sản phẩm mới</span>
                  </button>
                </div>
              </div>

              {/* Product Reorder Tip Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center space-x-2.5">
                  <ArrowUpDown className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Sắp xếp thứ tự sản phẩm:</strong> Bấm nút <strong>↑</strong> (Lên) hoặc <strong>↓</strong> (Xuống) ở cột <strong>Thứ tự</strong> để đổi vị trí hiển thị trên Trang chủ và các danh mục.
                  </span>
                </div>
                {isUpdatingOrder && (
                  <span className="text-[11px] font-semibold text-amber-700 flex items-center space-x-1 animate-pulse">
                    <span>Đang lưu...</span>
                  </span>
                )}
              </div>

              {/* Product List Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase">
                    <tr>
                      <th className="p-4 font-semibold text-center w-28">Thứ tự</th>
                      <th className="p-4 font-semibold">Ảnh chính & phụ</th>
                      <th className="p-4 font-semibold">Tên sản phẩm</th>
                      <th className="p-4 font-semibold">Danh mục</th>
                      <th className="p-4 font-semibold">Mô tả / Subtitle</th>
                      <th className="p-4 font-semibold">Giá bán</th>
                      <th className="p-4 font-semibold">Giá niêm yết (Gốc)</th>
                      <th className="p-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products
                      .filter(p => p.title.toLowerCase().includes(searchProduct.toLowerCase()))
                      .map((p) => {
                        const globalIndex = products.findIndex(item => item.id === p.id);
                        return (
                          <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center space-x-1 bg-neutral-100/90 rounded-lg p-1 border border-neutral-200">
                                <button
                                  type="button"
                                  onClick={() => handleMoveProduct(p.id, 'up')}
                                  disabled={globalIndex <= 0 || isUpdatingOrder}
                                  className="p-1 rounded text-neutral-600 hover:text-amber-800 hover:bg-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                                  title="Chuyển lên trên"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-mono text-xs font-bold text-amber-900 px-1 min-w-[28px] text-center select-none">
                                  #{globalIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveProduct(p.id, 'down')}
                                  disabled={globalIndex >= products.length - 1 || isUpdatingOrder}
                                  className="p-1 rounded text-neutral-600 hover:text-amber-800 hover:bg-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                                  title="Chuyển xuống dưới"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden border flex-shrink-0 flex items-center justify-center"><img src={p.imageSrc} alt={p.imageAlt} className="w-full h-full object-contain" referrerPolicy="no-referrer" /></div>
                                <span className="text-xs text-neutral-500 font-medium">
                                  ({p.thumbnails?.length || 1} ảnh)
                                </span>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-neutral-900">{p.title}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {(() => {
                                  const catList = (p.category || 'deals').split(',').map(s => s.trim()).filter(Boolean);
                                  return catList.map((c) => {
                                    if (c === 'deals') return <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Ưu Đãi & Combo</span>;
                                    if (c === 'groin') return <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">Chăm Sóc Vùng Kín</span>;
                                    if (c === 'beard') return <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Râu & Mặt</span>;
                                    if (c === 'body') return <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">Tóc & Toàn Thân</span>;
                                    return <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">{c}</span>;
                                  });
                                })()}
                              </div>
                            </td>
                            <td className="p-4 text-neutral-600 text-xs max-w-xs truncate">{p.subtitle}</td>
                            {(() => {
                              const { salePrice, originalPrice } = getProductPrices(p.vipPrice, p.regularPrice);
                              return (
                                <>
                                  <td className="p-4 font-bold text-neutral-900">{salePrice}</td>
                                  <td className="p-4 text-neutral-400 line-through text-xs font-normal">{originalPrice}</td>
                                </>
                              );
                            })()}
                            <td className="p-4 text-right space-x-2">
                              <a
                                href={p.href || `/products/${p.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 hover:text-neutral-900 transition-colors inline-block cursor-pointer"
                                title="Xem trang sản phẩm thực tế"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-block cursor-pointer"
                                title="Sửa thông tin chi tiết sản phẩm"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors inline-block cursor-pointer"
                                title="Xóa sản phẩm khỏi database"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-neutral-500">
                          <Package className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                          <p className="font-bold text-neutral-700">Chưa có sản phẩm nào trong cơ sở dữ liệu</p>
                          <p className="text-xs text-neutral-400 mt-1">
                            Bấm nút &ldquo;+ Thêm sản phẩm mới&rdquo; ở trên để tạo sản phẩm, hoặc bấm &ldquo;Khôi phục mặc định&rdquo; để nạp lại sản phẩm mẫu.
                          </p>
                        </td>
                      </tr>
                    )}
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
                      <th className="p-4 font-semibold">Thời gian đặt</th>
                      <th className="p-4 font-semibold">Khách hàng</th>
                      <th className="p-4 font-semibold">Sản phẩm đặt</th>
                      <th className="p-4 font-semibold">Tổng tiền</th>
                      <th className="p-4 font-semibold">Trạng thái</th>
                      <th className="p-4 font-semibold text-right">Thao tác &amp; Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-neutral-400 text-sm">
                          Chưa có đơn hàng nào trong cơ sở dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter(o => o.customerName.toLowerCase().includes(searchOrder.toLowerCase()) || o.id.toLowerCase().includes(searchOrder.toLowerCase()))
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                            <td className="p-4 font-bold text-neutral-900 font-mono text-xs">{order.id}</td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="inline-flex items-center space-x-1.5 text-neutral-800 text-xs font-semibold bg-amber-50/80 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span>{order.createdAt || 'Mới đặt'}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-neutral-900 block">{order.customerName}</span>
                              <span className="text-xs text-neutral-500">{order.phone} • {order.address}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium text-neutral-800 block">{order.productName}</span>
                              <span className="text-xs text-neutral-500">{order.variant} (SL: {order.quantity})</span>
                            </td>
                            <td className="p-4 font-bold text-amber-700">{formatVND(order.totalPrice)}</td>
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
                              <div className="flex items-center justify-end space-x-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderItem['status'])}
                                  className="bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                                  title="Cập nhật trạng thái giao hàng"
                                >
                                  <option value="Đang xử lý">Đang xử lý</option>
                                  <option value="Đang giao">Đang giao</option>
                                  <option value="Đã giao">Đã giao</option>
                                  <option value="Đã hủy">Đã hủy</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => setOrderToDelete(order)}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                  title="Xóa vĩnh viễn đơn hàng này"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <MediaManager mediaList={mediaList} />
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

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span>Danh mục sản phẩm (Chọn 1 hoặc nhiều danh mục) *</span>
                  <span className="text-[11px] font-normal text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Đã chọn: {newCategories.length} danh mục
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'deals', label: 'Ưu Đãi & Combo', desc: 'Sets, Kits, Deals' },
                    { id: 'groin', label: 'Chăm Sóc Vùng Kín', desc: 'Groin & Body' },
                    { id: 'beard', label: 'Râu & Mặt', desc: 'Beard & Face' },
                    { id: 'body', label: 'Tóc & Toàn Thân', desc: 'Head & Body' },
                  ].map((cat) => {
                    const isSelected = newCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleNewCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 text-amber-950 font-bold'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-400'}`}>
                              {isSelected && '✓'}
                            </span>
                            <span>{cat.label}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-normal block">{cat.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Đường dẫn sản phẩm (Product URL / Slug)
                  </label>
                  <span className="text-[11px] text-neutral-400">Tùy chọn tạo link đẹp</span>
                </div>
                <div className="flex items-center rounded-xl border border-neutral-300 bg-neutral-50 overflow-hidden focus-within:border-amber-600 focus-within:ring-1 focus-within:ring-amber-600 shadow-2xs">
                  <span className="px-3 text-xs font-mono text-neutral-600 bg-neutral-100 border-r border-neutral-300 py-2.5 select-none flex items-center gap-1.5 flex-shrink-0">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span>/products/</span>
                  </span>
                  <input
                    type="text"
                    value={newHref.replace(/^\/products\//, '').replace(/^\//, '')}
                    onChange={(e) => {
                      const cleanSlug = e.target.value.trim().replace(/^\/+/, '');
                      setNewHref(cleanSlug ? `/products/${cleanSlug}` : '');
                    }}
                    placeholder="ví dụ: tong-do-ultra-gen-6 (để trống sẽ tạo tự động)"
                    className="w-full bg-white px-3 py-2 text-sm font-mono text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá bán chính thức</label>
                  <input
                    type="text"
                    value={newVipPrice}
                    onChange={(e) => setNewVipPrice(e.target.value)}
                    required
                    placeholder="Ví dụ: $109.99"
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá niêm yết (Gốc)</label>
                  <input
                    type="text"
                    value={newRegularPrice}
                    onChange={(e) => setNewRegularPrice(e.target.value)}
                    required
                    placeholder="Ví dụ: $119.99"
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Đoạn mô tả chi tiết (Hiển thị giữa giá và FAQs)</label>
                <textarea
                  value={newDetailedDescription}
                  onChange={(e) => setNewDetailedDescription(e.target.value)}
                  rows={5}
                  placeholder="Nhập nội dung mô tả, gói bao gồm (PACKAGE INCLUDES), quà tặng..."
                  className="w-full border border-neutral-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <ProductImagePicker
                mainImage={newImageSrc}
                onMainImageChange={(url) => setNewImageSrc(url)}
                thumbnailsText={newThumbnailsText}
                onThumbnailsTextChange={(text) => setNewThumbnailsText(text)}
                onOpenMediaPickerForMain={() => setMediaPickerTarget('add-main')}
                onOpenMediaPickerForThumb={() => setMediaPickerTarget('add-thumb')}
              />

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

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span>Danh mục sản phẩm (Chọn 1 hoặc nhiều danh mục) *</span>
                  <span className="text-[11px] font-normal text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Đã chọn: {((editingProduct.category || 'deals').split(',').map(s=>s.trim()).filter(Boolean)).length} danh mục
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'deals', label: 'Ưu Đãi & Combo', desc: 'Sets, Kits, Deals' },
                    { id: 'groin', label: 'Chăm Sóc Vùng Kín', desc: 'Groin & Body' },
                    { id: 'beard', label: 'Râu & Mặt', desc: 'Beard & Face' },
                    { id: 'body', label: 'Tóc & Toàn Thân', desc: 'Head & Body' },
                  ].map((cat) => {
                    const selectedList = (editingProduct.category || 'deals').split(',').map(s => s.trim()).filter(Boolean);
                    const isSelected = selectedList.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleEditCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 text-amber-950 font-bold'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-neutral-400'}`}>
                              {isSelected && '✓'}
                            </span>
                            <span>{cat.label}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-normal block">{cat.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700">
                    Đường dẫn URL sản phẩm (Product URL / Slug) *
                  </label>
                  <span className="text-[11px] text-neutral-400">Tùy biến link chi tiết sản phẩm</span>
                </div>
                <div className="flex items-center rounded-xl border border-neutral-300 bg-neutral-50 overflow-hidden focus-within:border-amber-600 focus-within:ring-1 focus-within:ring-amber-600 shadow-2xs">
                  <span className="px-3 text-xs font-mono text-neutral-600 bg-neutral-100 border-r border-neutral-300 py-2.5 select-none flex items-center gap-1.5 flex-shrink-0">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span>/products/</span>
                  </span>
                  <input
                    type="text"
                    value={(editingProduct.href || '').replace(/^\/products\//, '').replace(/^\//, '')}
                    onChange={(e) => {
                      const cleanSlug = e.target.value.trim().replace(/^\/+/, '');
                      setEditingProduct({
                        ...editingProduct,
                        href: cleanSlug ? `/products/${cleanSlug}` : `/products/${editingProduct.id}`
                      });
                    }}
                    placeholder={editingProduct.id}
                    className="w-full bg-white px-3 py-2 text-sm font-mono text-neutral-900 focus:outline-none"
                  />
                  {editingProduct.href && (
                    <a
                      href={editingProduct.href.startsWith('/') ? editingProduct.href : `/products/${editingProduct.href}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-l border-neutral-300 flex items-center gap-1.5 transition select-none flex-shrink-0"
                      title="Mở xem trang chi tiết sản phẩm này trên tab mới"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem thử</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Liên kết truy cập: <strong className="font-mono text-amber-900">{editingProduct.href || `/products/${editingProduct.id}`}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá bán chính thức</label>
                  <input
                    type="text"
                    value={editingProduct.vipPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, vipPrice: e.target.value })}
                    required
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá niêm yết (Gốc)</label>
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
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Vị trí thứ tự hiển thị (1 đến {products.length})
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={1}
                    max={products.length}
                    value={typeof editingProduct.orderIndex === 'number' ? editingProduct.orderIndex + 1 : 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) {
                        setEditingProduct({ ...editingProduct, orderIndex: val - 1 });
                      }
                    }}
                    className="w-32 border border-neutral-300 rounded-xl px-4 py-2 text-sm font-mono font-bold focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-xs text-neutral-500">
                    Vị trí #1 sẽ hiển thị đầu tiên trên Trang chủ và danh mục sản phẩm.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Đoạn mô tả chi tiết (Hiển thị giữa giá và FAQs)</label>
                <textarea
                  value={editingProduct.detailedDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, detailedDescription: e.target.value })}
                  rows={5}
                  placeholder="Nhập nội dung mô tả, gói bao gồm (PACKAGE INCLUDES), quà tặng..."
                  className="w-full border border-neutral-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <ProductImagePicker
                mainImage={editingProduct.imageSrc}
                onMainImageChange={(url) => setEditingProduct({ ...editingProduct, imageSrc: url })}
                thumbnailsText={editThumbnailsText}
                onThumbnailsTextChange={(text) => setEditThumbnailsText(text)}
                onOpenMediaPickerForMain={() => setMediaPickerTarget('edit-main')}
                onOpenMediaPickerForThumb={() => setMediaPickerTarget('edit-thumb')}
              />

              {/* PACKAGE ACCESSORIES MANAGER ("TRỌN BỘ PHỤ KIỆN TRONG HỘP") */}
              <div className="pt-5 border-t border-neutral-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Quản lý phụ kiện trong hộp (&ldquo;TRỌN BỘ PHỤ KIỆN TRONG HỘP&rdquo;)</span>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Thêm, bớt, chỉnh sửa tên, ảnh và mô tả từng món phụ kiện hiển thị ở trang chi tiết sản phẩm.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const curItems = editingProduct.packageIncludes || [];
                      const newItem: PackageItem = {
                        id: `pkg-item-${Date.now()}`,
                        name: 'Phụ kiện mới',
                        subtitle: 'Thành phần trong hộp',
                        imageSrc: editingProduct.imageSrc || '/assets/aistudio/30-00006-NA_f201a618.png',
                        isGift: false,
                        description: 'Mô tả chi tiết công dụng của món phụ kiện này.'
                      };
                      setEditingProduct({
                        ...editingProduct,
                        packageIncludes: [...curItems, newItem]
                      });
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs cursor-pointer select-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm món phụ kiện</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingProduct.packageIncludes || []).length === 0 ? (
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                      Chưa có món phụ kiện nào. Bấm nút <strong>&ldquo;+ Thêm món phụ kiện&rdquo;</strong> ở trên để tạo danh sách món trong hộp.
                    </div>
                  ) : (
                    (editingProduct.packageIncludes || []).map((pkgItem, pkgIdx) => (
                      <div
                        key={pkgItem.id || `pkg-${pkgIdx}`}
                        className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 relative space-y-3 shadow-2xs group hover:border-amber-400 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Image Box & Media Picker Trigger */}
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 bg-white border border-neutral-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                              <img
                                src={pkgItem.imageSrc}
                                alt={pkgItem.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget(`package-item-${pkgIdx}`)}
                                className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 transition flex items-center gap-1 cursor-pointer select-none"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                                <span>Đổi ảnh</span>
                              </button>
                              <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-[140px]">
                                {pkgItem.imageSrc?.split('/').pop() || 'Ảnh phụ kiện'}
                              </p>
                            </div>
                          </div>

                          {/* Badge Type Selector & Remove Button */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...(editingProduct.packageIncludes || [])];
                                newItems[pkgIdx] = { ...newItems[pkgIdx], isGift: !newItems[pkgIdx].isGift };
                                setEditingProduct({ ...editingProduct, packageIncludes: newItems });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer select-none border ${
                                pkgItem.isGift
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-neutral-200 text-neutral-700 border-neutral-300'
                              }`}
                            >
                              {pkgItem.isGift ? '🎁 Quà tặng' : '📦 Trong hộp'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (editingProduct.packageIncludes || []).filter((_, idx) => idx !== pkgIdx);
                                setEditingProduct({ ...editingProduct, packageIncludes: newItems });
                              }}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                              title="Xóa món phụ kiện này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Name & Subtitle inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">Tên món phụ kiện *</label>
                            <input
                              type="text"
                              value={pkgItem.name}
                              onChange={(e) => {
                                const newItems = [...(editingProduct.packageIncludes || [])];
                                newItems[pkgIdx] = { ...newItems[pkgIdx], name: e.target.value };
                                setEditingProduct({ ...editingProduct, packageIncludes: newItems });
                              }}
                              placeholder="Ví dụ: Cáp sạc USB-C"
                              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-600 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">Mô tả ngắn / Subtitle</label>
                            <input
                              type="text"
                              value={pkgItem.subtitle || ''}
                              onChange={(e) => {
                                const newItems = [...(editingProduct.packageIncludes || [])];
                                newItems[pkgIdx] = { ...newItems[pkgIdx], subtitle: e.target.value };
                                setEditingProduct({ ...editingProduct, packageIncludes: newItems });
                              }}
                              placeholder="Ví dụ: Sạc nhanh 90 phút"
                              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-600"
                            />
                          </div>
                        </div>

                        {/* Extended Description input for Lightbox */}
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">Mô tả chi tiết (khi bấm vào xem)</label>
                          <input
                            type="text"
                            value={pkgItem.description || ''}
                            onChange={(e) => {
                              const newItems = [...(editingProduct.packageIncludes || [])];
                              newItems[pkgIdx] = { ...newItems[pkgIdx], description: e.target.value };
                              setEditingProduct({ ...editingProduct, packageIncludes: newItems });
                            }}
                            placeholder="Ví dụ: Dụng cụ vệ sinh và dầu bôi trơn chuyên dụng giữ cho lưỡi máy luôn sắc bén..."
                            className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-600"
                          />
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* VIDEO REVIEWS SECTION */}
              <div className="pt-5 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
                      <Film className="w-4 h-4 text-amber-600" />
                      <span>Video Reviews cho sản phẩm này (&ldquo;Sức nóng là có thật.&rdquo;)</span>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Cấu hình 3 video review hiển thị ở trang chi tiết sản phẩm bằng link YouTube hoặc YouTube Shorts.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(editingProduct.videoReviews || []).map((review, rIdx) => (
                    <div key={review.id || rIdx} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1.5">
                          <Film className="w-3.5 h-3.5 text-amber-600" />
                          <span>Video Review #{rIdx + 1} {rIdx === 0 ? '(Mở đầu / Mặc định)' : ''}</span>
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          Slot {rIdx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Tên tài khoản (Handle)
                          </label>
                          <input
                            type="text"
                            value={review.handle}
                            onChange={(e) => {
                              const next = [...(editingProduct.videoReviews || [])];
                              next[rIdx] = { ...next[rIdx], handle: e.target.value.replace(/^@/, '') };
                              setEditingProduct({ ...editingProduct, videoReviews: next });
                            }}
                            placeholder="ví dụ: pierredalati"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-amber-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            Tên hiển thị Reviewer
                          </label>
                          <input
                            type="text"
                            value={review.name}
                            onChange={(e) => {
                              const next = [...(editingProduct.videoReviews || [])];
                              next[rIdx] = { ...next[rIdx], name: e.target.value };
                              setEditingProduct({ ...editingProduct, videoReviews: next });
                            }}
                            placeholder="ví dụ: Pierre Dalati"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      </div>

                      {/* Video URL input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-neutral-700">
                            Link YouTube / YouTube Shorts *
                          </label>
                          <span className="text-[10px] text-neutral-500 font-semibold">
                            (Dán link YouTube Shorts hoặc Watch)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={review.videoUrl}
                          onChange={(e) => {
                            const next = [...(editingProduct.videoReviews || [])];
                            next[rIdx] = { ...next[rIdx], videoUrl: e.target.value };
                            setEditingProduct({ ...editingProduct, videoReviews: next });
                          }}
                          placeholder="https://www.youtube.com/shorts/... hoặc https://youtu.be/..."
                          required
                          className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white font-mono focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      {/* Poster image with Pick button */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-neutral-700">
                            Ảnh đại diện (Poster Thumbnail)
                          </label>
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget(`edit-poster-${rIdx}`)}
                            className="text-[11px] text-amber-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Tải ảnh từ máy / Chọn từ Media</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={review.largePoster}
                          onChange={(e) => {
                            const next = [...(editingProduct.videoReviews || [])];
                            next[rIdx] = { 
                              ...next[rIdx], 
                              largePoster: e.target.value,
                              compactPoster: next[rIdx].compactPoster || e.target.value
                            };
                            setEditingProduct({ ...editingProduct, videoReviews: next });
                          }}
                          placeholder="/assets/aistudio/... hoặc /uploads/..."
                          className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white font-mono focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      {/* Quote */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Trích dẫn nhận xét (Quote)
                        </label>
                        <input
                          type="text"
                          value={review.quote || ''}
                          onChange={(e) => {
                            const next = [...(editingProduct.videoReviews || [])];
                            next[rIdx] = { ...next[rIdx], quote: e.target.value };
                            setEditingProduct({ ...editingProduct, videoReviews: next });
                          }}
                          placeholder="Cảm nhận của người dùng về sản phẩm..."
                          className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-lg text-neutral-900">
                Chọn tệp từ Thư viện Media
              </h3>
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">
              <MediaManager
                mediaList={mediaList}
                selectionMode={true}
                onSelectMedia={(url) => {
                  if (mediaPickerTarget === 'add-main') {
                    setNewImageSrc(url);
                  } else if (mediaPickerTarget === 'add-thumb') {
                    setNewThumbnailsText((prev) => (prev ? `${prev}\n${url}` : url));
                  } else if (mediaPickerTarget === 'edit-main' && editingProduct) {
                    setEditingProduct({ ...editingProduct, imageSrc: url });
                  } else if (mediaPickerTarget === 'edit-thumb') {
                    setEditThumbnailsText((prev) => (prev ? `${prev}\n${url}` : url));
                  } else if (mediaPickerTarget?.startsWith('edit-video-') && editingProduct) {
                    const rIdx = parseInt(mediaPickerTarget.replace('edit-video-', ''), 10);
                    const currentReviews = [...(editingProduct.videoReviews || [])];
                    if (currentReviews[rIdx]) {
                      currentReviews[rIdx] = { ...currentReviews[rIdx], videoUrl: url };
                      setEditingProduct({ ...editingProduct, videoReviews: currentReviews });
                      showToast(`Đã gán video cho Review #${rIdx + 1}!`);
                    }
                  } else if (mediaPickerTarget?.startsWith('edit-poster-') && editingProduct) {
                    const rIdx = parseInt(mediaPickerTarget.replace('edit-poster-', ''), 10);
                    const currentReviews = [...(editingProduct.videoReviews || [])];
                    if (currentReviews[rIdx]) {
                      currentReviews[rIdx] = { 
                        ...currentReviews[rIdx], 
                        largePoster: url, 
                        compactPoster: currentReviews[rIdx].compactPoster || url 
                      };
                      setEditingProduct({ ...editingProduct, videoReviews: currentReviews });
                      showToast(`Đã gán poster cho Review #${rIdx + 1}!`);
                    }
                  } else if (mediaPickerTarget?.startsWith('package-item-') && editingProduct) {
                    const pkgIdx = parseInt(mediaPickerTarget.replace('package-item-', ''), 10);
                    const currentPkg = [...(editingProduct.packageIncludes || [])];
                    if (currentPkg[pkgIdx]) {
                      currentPkg[pkgIdx] = { ...currentPkg[pkgIdx], imageSrc: url };
                      setEditingProduct({ ...editingProduct, packageIncludes: currentPkg });
                      showToast(`Đã đổi ảnh cho phụ kiện "${currentPkg[pkgIdx].name}"!`);
                    }
                  }
                  setMediaPickerTarget(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn border border-neutral-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Xác nhận xóa sản phẩm</h3>
                <p className="text-xs text-neutral-500">Hành động này sẽ xóa vĩnh viễn sản phẩm</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh mục bán buôn và cơ sở dữ liệu Firestore?
            </p>

            {/* Product Snapshot */}
            <div className="bg-[#f9f9f8] p-3.5 rounded-xl border border-neutral-200 flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white rounded-lg border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center"><img src={productToDelete.imageSrc} alt={productToDelete.imageAlt || productToDelete.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" /></div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-neutral-900 truncate">{productToDelete.title}</h4>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{productToDelete.subtitle}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs font-bold text-neutral-900">{productToDelete.regularPrice || productToDelete.vipPrice}</span>
                  <span className="text-[11px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">
                    {productToDelete.thumbnails?.length || 1} ảnh
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-neutral-100">
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={executeDeleteProduct}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDeletingProduct ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xác nhận xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn border border-neutral-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Xác nhận xóa đơn hàng</h3>
                <p className="text-xs text-neutral-500">Đơn #{orderToDelete.id}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này khỏi cơ sở dữ liệu Hostinger MySQL? Hành động này được đồng bộ tức thì và không thể hoàn tác.
            </p>

            {/* Order Snapshot */}
            <div className="bg-[#f9f9f8] p-4 rounded-xl border border-neutral-200 space-y-2 mb-6 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Thời gian đặt:</span>
                <span className="font-semibold text-neutral-900 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{orderToDelete.createdAt || 'N/A'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Khách hàng:</span>
                <span className="font-bold text-neutral-900">{orderToDelete.customerName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Số điện thoại:</span>
                <span className="font-mono font-semibold text-neutral-800">{orderToDelete.phone}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Địa chỉ giao:</span>
                <span className="text-neutral-700 max-w-[260px] text-right truncate" title={orderToDelete.address}>{orderToDelete.address}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Sản phẩm:</span>
                <span className="font-semibold text-neutral-900 max-w-[260px] text-right truncate">
                  {orderToDelete.productName} ({orderToDelete.variant} x{orderToDelete.quantity})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Phương thức:</span>
                <span className="font-semibold text-neutral-700">{orderToDelete.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-500 font-bold">Tổng thanh toán:</span>
                <span className="font-extrabold text-sm text-amber-700">{orderToDelete.totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-neutral-100">
              <button
                type="button"
                disabled={isDeletingOrder}
                onClick={() => setOrderToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeletingOrder}
                onClick={executeDeleteOrder}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDeletingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa Firestore...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xác nhận xóa vĩnh viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center space-x-2.5 ${
          toastMessage.isError 
            ? 'bg-red-900 text-white border-red-700' 
            : 'bg-neutral-900 text-white border-neutral-800'
        }`}>
          {toastMessage.isError ? (
            <AlertTriangle className="w-4 h-4 text-red-300 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
