import { featuredProductsConfig2, type ProductItem } from '@/config/products';

export interface OrderItem {
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
  createdAtISO?: string;
  timestamp?: number;
  paymentMethod?: string;
  notes?: string;
  discountCode?: string;
  discountAmount?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  mediaType?: 'image' | 'video';
  size?: number;
  createdAt: string;
}

let isSyncingProducts = false;

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Seed initial products to Hostinger MySQL (Disabled to prevent auto-restoring deleted products)
 */
export async function seedInitialProductsIfNeeded() {
  return;
}

/**
 * Restore products
 */
export async function restoreDefaultProducts() {
  try {
    const res = await fetch('/api/db/sync?force=true', {
      method: 'POST',
      cache: 'no-store',
      headers: noCacheHeaders,
    });
    const data = await res.json();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_products_changed'));
    }
    return data;
  } catch (err) {
    console.error('Failed to restore products:', err);
    throw err;
  }
}

/**
 * Real-time listener for products (100% Hostinger MySQL, cross-device sync)
 */
export function subscribeProducts(
  onData: (products: ProductItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/db/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: noCacheHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch products from MySQL');
      const data = await res.json();
      if (isMounted) {
        if (Array.isArray(data.products)) {
          onData(data.products);
        } else {
          onData(featuredProductsConfig2.products);
        }
      }
    } catch (err) {
      if (isMounted) {
        console.warn('Products fetch note, using local config:', err);
        onData(featuredProductsConfig2.products);
        if (onError) onError(err);
      }
    }
  };

  fetchProducts();

  const handleUpdate = () => {
    fetchProducts();
  };

  const handleVisibility = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchProducts();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_products_changed', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('visibilitychange', handleVisibility);
  }

  // Poll every 3 seconds for snappy cross-device updates
  const interval = setInterval(fetchProducts, 60000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_products_changed', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

/**
 * Subscribe product by ID
 */
export function subscribeProductById(
  id: string,
  onData: (product: ProductItem | null) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchOne = async () => {
    try {
      const res = await fetch(`/api/db/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: noCacheHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (isMounted) {
        const cleanId = decodeURIComponent(id).trim().toLowerCase();
        const found = (data.products || []).find((p: ProductItem) => {
          const pId = p.id.toLowerCase();
          const pHrefSlug = (p.href || '').toLowerCase().replace(/^\/products\//, '').replace(/^\//, '');
          return (
            pId === cleanId ||
            pHrefSlug === cleanId ||
            p.href?.toLowerCase() === `/products/${cleanId}` ||
            p.href?.toLowerCase() === cleanId
          );
        });
        if (found) {
          onData(found);
        } else {
          const fallback = featuredProductsConfig2.products.find((p) => {
            const pId = p.id.toLowerCase();
            const pHrefSlug = (p.href || '').toLowerCase().replace(/^\/products\//, '').replace(/^\//, '');
            return (
              pId === cleanId ||
              pHrefSlug === cleanId ||
              p.href?.toLowerCase() === `/products/${cleanId}` ||
              p.href?.toLowerCase() === cleanId
            );
          }) || null;
          onData(fallback);
        }
      }
    } catch (err) {
      if (isMounted) {
        const cleanId = decodeURIComponent(id).trim().toLowerCase();
        const fallback = featuredProductsConfig2.products.find((p) => {
          const pId = p.id.toLowerCase();
          const pHrefSlug = (p.href || '').toLowerCase().replace(/^\/products\//, '').replace(/^\//, '');
          return (
            pId === cleanId ||
            pHrefSlug === cleanId ||
            p.href?.toLowerCase() === `/products/${cleanId}` ||
            p.href?.toLowerCase() === cleanId
          );
        }) || null;
        onData(fallback);
        if (onError) onError(err);
      }
    }
  };

  fetchOne();

  const handleUpdate = () => fetchOne();
  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_products_changed', handleUpdate);
    window.addEventListener('focus', handleUpdate);
  }

  const interval = setInterval(fetchOne, 60000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_products_changed', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    }
  };
}

/**
 * Save / Update product in Hostinger MySQL
 */
export async function saveProductToDb(product: ProductItem) {
  try {
    const res = await fetch('/api/db/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...noCacheHeaders,
      },
      cache: 'no-store',
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save product to Hostinger MySQL');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_products_changed'));
    }
    return product;
  } catch (error) {
    console.error('saveProductToDb error:', error);
    throw error;
  }
}

/**
 * Batch update display order of products
 */
export async function updateProductOrderInDb(productOrders: { id: string; orderIndex: number }[]) {
  try {
    for (const item of productOrders) {
      const pRes = await fetch(`/api/db/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: noCacheHeaders,
      });
      const pData = await pRes.json();
      const current = (pData.products || []).find((p: ProductItem) => p.id === item.id);
      if (current) {
        await saveProductToDb({ ...current, orderIndex: item.orderIndex });
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_products_changed'));
    }
  } catch (error) {
    console.error('updateProductOrderInDb error:', error);
    throw error;
  }
}

/**
 * Delete product from Hostinger MySQL
 */
export async function deleteProductFromDb(id: string) {
  try {
    const res = await fetch(`/api/db/products?id=${id}&t=${Date.now()}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: noCacheHeaders,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product from Hostinger MySQL');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_products_changed'));
    }
    return { success: true };
  } catch (error) {
    console.error('deleteProductFromDb error:', error);
    throw error;
  }
}

/**
 * Seed initial orders if needed (No-op: real orders only)
 */
export async function seedInitialOrdersIfNeeded() {
  return;
}

/**
 * Real-time listener for orders (100% Hostinger MySQL, cross-device sync)
 */
export function subscribeOrders(
  onData: (orders: OrderItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/db/orders?t=${Date.now()}`, {
        cache: 'no-store',
        headers: noCacheHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch orders from Hostinger MySQL');
      const data = await res.json();
      
      const mysqlOrders: OrderItem[] = data.orders || [];
      const DUMMY_ORDER_IDS = new Set(['ORD-9821', 'ORD-9820', 'ORD-9819']);

      // MySQL is authoritative: filter out dummy seeds and present true DB orders
      const items = mysqlOrders.filter((o) => o.id && !DUMMY_ORDER_IDS.has(o.id));
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

      if (isMounted) {
        onData(items);
      }
    } catch (err) {
      if (isMounted) {
        if (typeof window !== 'undefined') {
          try {
            const localOrders: OrderItem[] = JSON.parse(localStorage.getItem('manscaped_local_orders') || '[]');
            onData(localOrders);
          } catch {
            onData([]);
          }
        }
        if (onError) onError(err);
      }
    }
  };

  fetchOrders();

  const handleUpdate = () => {
    fetchOrders();
  };

  const handleVisibility = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchOrders();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_orders_changed', handleUpdate);
    window.addEventListener('manscaped_order_created', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('visibilitychange', handleVisibility);
  }

  // Poll orders every 3 seconds for real-time cross-device sync
  const interval = setInterval(fetchOrders, 60000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_orders_changed', handleUpdate);
      window.removeEventListener('manscaped_order_created', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

/**
 * Update order status in Hostinger MySQL
 */
export async function updateOrderStatusInDb(orderId: string, status: OrderItem['status']) {
  if (typeof window !== 'undefined') {
    try {
      const stored: OrderItem[] = JSON.parse(localStorage.getItem('manscaped_local_orders') || '[]');
      const updated = stored.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem('manscaped_local_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch('/api/db/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...noCacheHeaders,
      },
      cache: 'no-store',
      body: JSON.stringify({ id: orderId, status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_orders_changed'));
    }
  } catch (error) {
    console.error('updateOrderStatusInDb error:', error);
    throw error;
  }
}

/**
 * Create new order with sanitized payload into Hostinger MySQL
 */
export async function createOrderInDb(order: OrderItem) {
  const cleanOrder: OrderItem = {
    id: order.id,
    customerName: order.customerName || '',
    phone: order.phone || '',
    address: order.address || '',
    productName: order.productName || 'The Lawn Mower® Ultra Gen 6',
    variant: order.variant || 'Standard',
    quantity: typeof order.quantity === 'number' ? order.quantity : 1,
    totalPrice: order.totalPrice || '$0.00',
    status: order.status || 'Đang xử lý',
    createdAt: order.createdAt || new Date().toLocaleString('vi-VN'),
    paymentMethod: order.paymentMethod || 'COD',
    notes: order.notes || '',
    discountCode: order.discountCode || '',
    discountAmount: order.discountAmount || '',
  };

  // 1. Immediately store in localStorage so it's guaranteed to be available locally
  if (typeof window !== 'undefined') {
    try {
      const stored: OrderItem[] = JSON.parse(localStorage.getItem('manscaped_local_orders') || '[]');
      const filtered = stored.filter((o) => o.id !== cleanOrder.id);
      localStorage.setItem('manscaped_local_orders', JSON.stringify([cleanOrder, ...filtered]));
      window.dispatchEvent(new CustomEvent('manscaped_order_created', { detail: cleanOrder }));
    } catch (e) {
      console.warn('Local order storage note:', e);
    }
  }

  // 2. Persist to Hostinger MySQL
  try {
    const res = await fetch('/api/db/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...noCacheHeaders,
      },
      cache: 'no-store',
      body: JSON.stringify(cleanOrder),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Failed to save order to MySQL:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_orders_changed'));
    }
  } catch (err) {
    console.error('Error saving order to Hostinger MySQL:', err);
  }

  return cleanOrder;
}

/**
 * Delete order from Hostinger MySQL and local cache
 */
export async function deleteOrderFromDb(orderId: string) {
  if (typeof window !== 'undefined') {
    try {
      const stored: OrderItem[] = JSON.parse(localStorage.getItem('manscaped_local_orders') || '[]');
      const updated = stored.filter((o) => o.id !== orderId);
      localStorage.setItem('manscaped_local_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch(`/api/db/orders?id=${orderId}&t=${Date.now()}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: noCacheHeaders,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete order from MySQL');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_orders_changed'));
    }
    return { success: true };
  } catch (error) {
    console.error('deleteOrderFromDb error:', error);
    throw error;
  }
}

/**
 * Search orders by ID or customer phone number
 */
export async function trackOrdersByQuery(queryStr: string): Promise<OrderItem[]> {
  try {
    const rawTrimmed = (queryStr || '').trim();
    if (!rawTrimmed) return [];

    const lowerQuery = rawTrimmed.toLowerCase();
    if (lowerQuery.length < 3) return [];

    const res = await fetch(`/api/db/orders?t=${Date.now()}`, {
      cache: 'no-store',
      headers: noCacheHeaders,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const allOrders: OrderItem[] = data.orders || [];

    const cleanCandidate = lowerQuery.replace(/^#/, '');
    const queryDigits = cleanCandidate.replace(/\D/g, '');
    const isPhoneQuery = queryDigits.length >= 7;

    return allOrders.filter((order) => {
      const orderIdLower = (order.id || '').toLowerCase();
      const orderIdDigits = orderIdLower.replace(/\D/g, '');
      const orderPhoneDigits = (order.phone || '').replace(/\D/g, '');

      if (isPhoneQuery && orderPhoneDigits.length >= 7) {
        return (
          orderPhoneDigits === queryDigits ||
          orderPhoneDigits.endsWith(queryDigits) ||
          queryDigits.endsWith(orderPhoneDigits)
        );
      }

      return (
        orderIdLower === cleanCandidate ||
        orderIdLower.includes(cleanCandidate) ||
        (queryDigits.length >= 4 && orderIdDigits.includes(queryDigits))
      );
    });
  } catch (err) {
    console.error('trackOrdersByQuery error:', err);
    return [];
  }
}

export async function seedInitialMediaIfNeeded() {
  return;
}

/**
 * Subscribe media (100% Hostinger MySQL, cross-device sync)
 */
export function subscribeMedia(
  onData: (media: MediaItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchMedia = async () => {
    try {
      const res = await fetch(`/api/db/media?t=${Date.now()}`, {
        cache: 'no-store',
        headers: noCacheHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      if (isMounted) {
        onData(data.media || []);
      }
    } catch (err) {
      if (isMounted) {
        onData([]);
        if (onError) onError(err);
      }
    }
  };

  fetchMedia();

  const handleUpdate = () => fetchMedia();
  const handleVisibility = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchMedia();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_media_changed', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('visibilitychange', handleVisibility);
  }

  // Poll media every 3 seconds for real-time cross-device sync
  const interval = setInterval(fetchMedia, 60000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_media_changed', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

/**
 * Save media to Hostinger MySQL
 */
export async function saveMediaToDb(media: MediaItem) {
  try {
    const res = await fetch('/api/db/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...noCacheHeaders,
      },
      cache: 'no-store',
      body: JSON.stringify(media),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save media');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_media_changed'));
    }
  } catch (error) {
    console.error('saveMediaToDb error:', error);
    throw error;
  }
}

/**
 * Delete media from Hostinger MySQL
 */
export async function deleteMediaFromDb(id: string) {
  try {
    const res = await fetch(`/api/db/media?id=${id}&t=${Date.now()}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: noCacheHeaders,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete media');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_media_changed'));
    }
    return { success: true };
  } catch (error) {
    console.error('deleteMediaFromDb error:', error);
    throw error;
  }
}
