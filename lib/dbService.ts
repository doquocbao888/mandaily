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

/**
 * Seed initial products to Hostinger MySQL if needed
 */
export async function seedInitialProductsIfNeeded() {
  if (isSyncingProducts) return;
  isSyncingProducts = true;
  try {
    const res = await fetch('/api/db/status');
    const status = await res.json();
    if (status.connected) {
      await fetch('/api/db/sync', { method: 'POST' });
    }
  } catch (err) {
    console.warn('MySQL seed note:', err);
  } finally {
    isSyncingProducts = false;
  }
}

/**
 * Restore products
 */
export async function restoreDefaultProducts() {
  try {
    const res = await fetch('/api/db/sync', { method: 'POST' });
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
 * Real-time listener for products (100% Hostinger MySQL)
 */
export function subscribeProducts(
  onData: (products: ProductItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/db/products');
      if (!res.ok) throw new Error('Failed to fetch products from MySQL');
      const data = await res.json();
      if (isMounted) {
        if (data.products && data.products.length > 0) {
          onData(data.products);
        } else {
          // Fallback to default local products if MySQL is newly created
          onData(featuredProductsConfig2.products);
          fetch('/api/db/sync', { method: 'POST' }).catch(() => {});
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

  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_products_changed', handleUpdate);
  }

  // Periodic polling every 10 seconds to keep clients in sync
  const interval = setInterval(fetchProducts, 10000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_products_changed', handleUpdate);
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
      const res = await fetch('/api/db/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (isMounted) {
        const found = (data.products || []).find((p: ProductItem) => p.id === id);
        if (found) {
          onData(found);
        } else {
          const fallback = featuredProductsConfig2.products.find((p) => p.id === id) || null;
          onData(fallback);
        }
      }
    } catch (err) {
      if (isMounted) {
        const fallback = featuredProductsConfig2.products.find((p) => p.id === id) || null;
        onData(fallback);
        if (onError) onError(err);
      }
    }
  };

  fetchOne();

  const handleUpdate = () => fetchOne();
  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_products_changed', handleUpdate);
  }

  return () => {
    isMounted = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_products_changed', handleUpdate);
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
      headers: { 'Content-Type': 'application/json' },
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
      const pRes = await fetch('/api/db/products');
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
    const res = await fetch(`/api/db/products?id=${id}`, {
      method: 'DELETE',
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
 * Real-time listener for orders (100% Hostinger MySQL)
 */
export function subscribeOrders(
  onData: (orders: OrderItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/db/orders');
      if (!res.ok) throw new Error('Failed to fetch orders from Hostinger MySQL');
      const data = await res.json();
      
      const mysqlOrders: OrderItem[] = data.orders || [];
      const DUMMY_ORDER_IDS = new Set(['ORD-9821', 'ORD-9820', 'ORD-9819']);

      // Merge with any instant local orders placed in current session
      const itemsMap = new Map<string, OrderItem>();
      mysqlOrders.forEach((o) => {
        if (o.id && !DUMMY_ORDER_IDS.has(o.id)) itemsMap.set(o.id, o);
      });

      if (typeof window !== 'undefined') {
        try {
          const localOrders: OrderItem[] = JSON.parse(localStorage.getItem('manscaped_local_orders') || '[]');
          for (const localOrd of localOrders) {
            if (localOrd?.id && !DUMMY_ORDER_IDS.has(localOrd.id) && !itemsMap.has(localOrd.id)) {
              itemsMap.set(localOrd.id, localOrd);
            }
          }
        } catch {
          // ignore
        }
      }

      const items = Array.from(itemsMap.values());
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

      if (isMounted) {
        onData(items);
      }
    } catch (err) {
      if (isMounted) {
        // Fallback to local cache
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

  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_orders_changed', handleUpdate);
    window.addEventListener('manscaped_order_created', handleUpdate);
  }

  // Poll orders every 4 seconds for real-time order updates
  const interval = setInterval(fetchOrders, 4000);

  return () => {
    isMounted = false;
    clearInterval(interval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_orders_changed', handleUpdate);
      window.removeEventListener('manscaped_order_created', handleUpdate);
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
    await fetch('/api/db/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('manscaped_orders_changed'));
    }
  } catch (error) {
    console.error('updateOrderStatusInDb error:', error);
  }
}

/**
 * Create new order with sanitized payload & instant local backup into Hostinger MySQL
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
    await fetch('/api/db/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanOrder),
    });

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
    await fetch(`/api/db/orders?id=${orderId}`, {
      method: 'DELETE',
    });

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

    const res = await fetch('/api/db/orders');
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
 * Subscribe media (100% Hostinger MySQL)
 */
export function subscribeMedia(
  onData: (media: MediaItem[]) => void,
  onError?: (error: unknown) => void
) {
  let isMounted = true;

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/db/media');
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
  if (typeof window !== 'undefined') {
    window.addEventListener('manscaped_media_changed', handleUpdate);
  }

  return () => {
    isMounted = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('manscaped_media_changed', handleUpdate);
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
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`/api/db/media?id=${id}`, {
      method: 'DELETE',
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
