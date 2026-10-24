import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { featuredProductsConfig, featuredProductsConfig2, type ProductItem } from '@/config/products';

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
  paymentMethod?: string;
  notes?: string;
}

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

let isSeedingProducts = false;
let hasSeededProducts = false;

/**
 * Seed initial products if collection is completely empty (guarded to run once)
 * Does NOT resurrect products that were intentionally deleted by the user.
 */
export async function seedInitialProductsIfNeeded() {
  if (hasSeededProducts || isSeedingProducts) return;
  isSeedingProducts = true;
  try {
    const isBrowser = typeof window !== 'undefined';
    const alreadySeeded = isBrowser && localStorage.getItem('manscaped_products_seeded') === 'true';

    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snap.empty && !alreadySeeded) {
      for (let i = 0; i < featuredProductsConfig2.products.length; i++) {
        const prod = {
          ...featuredProductsConfig2.products[i],
          orderIndex: featuredProductsConfig2.products[i].orderIndex ?? i,
        };
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
      }
      if (isBrowser) localStorage.setItem('manscaped_products_seeded', 'true');
    }
    hasSeededProducts = true;
  } catch (err: any) {
    if (err?.name === 'AbortError' || String(err?.message || '').toLowerCase().includes('aborted')) {
      return;
    }
    console.warn('Initial products seed note:', err?.message || err);
  } finally {
    isSeedingProducts = false;
  }
}

/**
 * Manually restore the 5 default catalog products if requested by the admin
 */
export async function restoreDefaultProducts() {
  for (let i = 0; i < featuredProductsConfig2.products.length; i++) {
    const prod = {
      ...featuredProductsConfig2.products[i],
      orderIndex: featuredProductsConfig2.products[i].orderIndex ?? i,
    };
    await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
  }
}

let isSeedingOrders = false;
let hasSeededOrders = false;

/**
 * Seed initial orders if collection is empty (guarded to run once)
 */
export async function seedInitialOrdersIfNeeded() {
  if (hasSeededOrders || isSeedingOrders) return;
  isSeedingOrders = true;
  try {
    const isBrowser = typeof window !== 'undefined';
    const alreadySeeded = isBrowser && localStorage.getItem('manscaped_orders_seeded') === 'true';

    const snap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (snap.empty && !alreadySeeded) {
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
      ];
      for (const ord of initialOrders) {
        await setDoc(doc(db, ORDERS_COLLECTION, ord.id), ord);
      }
      if (isBrowser) localStorage.setItem('manscaped_orders_seeded', 'true');
    }
    hasSeededOrders = true;
  } catch (err: any) {
    if (err?.name === 'AbortError' || String(err?.message || '').toLowerCase().includes('aborted')) {
      return;
    }
    console.warn('Initial orders seed note:', err?.message || err);
  } finally {
    isSeedingOrders = false;
  }
}

/**
 * Real-time listener for products collection
 */
export function subscribeProducts(
  onData: (products: ProductItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: ProductItem[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as ProductItem);
      });
      items.sort((a, b) => {
        const orderA = typeof a.orderIndex === 'number' ? a.orderIndex : 9999;
        const orderB = typeof b.orderIndex === 'number' ? b.orderIndex : 9999;
        if (orderA !== orderB) return orderA - orderB;
        return a.id.localeCompare(b.id);
      });
      onData(items);
    },
    (error) => {
      const msg = String((error as any)?.message || error).toLowerCase();
      if ((error as any)?.name === 'AbortError' || msg.includes('aborted') || msg.includes('signal is aborted')) {
        return;
      }
      try {
        handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      } catch {
        // Handled
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time listener for single product by ID
 */
export function subscribeProductById(
  id: string,
  onData: (product: ProductItem | null) => void
) {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as ProductItem);
      } else {
        onData(null);
      }
    },
    (error) => {
      const msg = String((error as any)?.message || error).toLowerCase();
      if ((error as any)?.name === 'AbortError' || msg.includes('aborted') || msg.includes('signal is aborted')) {
        return;
      }
      try {
        handleFirestoreError(error, OperationType.GET, `${PRODUCTS_COLLECTION}/${id}`);
      } catch {
        // Handled
      }
    }
  );
}

/**
 * Save / Update product
 */
export async function saveProductToDb(product: ProductItem) {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

/**
 * Batch update display order of products
 */
export async function updateProductOrderInDb(productOrders: { id: string; orderIndex: number }[]) {
  try {
    const batch = writeBatch(db);
    for (const item of productOrders) {
      const docRef = doc(db, PRODUCTS_COLLECTION, item.id);
      batch.set(docRef, { orderIndex: item.orderIndex }, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, PRODUCTS_COLLECTION);
    throw error;
  }
}

/**
 * Delete product
 */
export async function deleteProductFromDb(id: string) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Real-time listener for orders collection
 */
export function subscribeOrders(
  onData: (orders: OrderItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: OrderItem[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as OrderItem);
      });
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onData(items);
    },
    (error) => {
      const msg = String((error as any)?.message || error).toLowerCase();
      if ((error as any)?.name === 'AbortError' || msg.includes('aborted') || msg.includes('signal is aborted')) {
        return;
      }
      try {
        handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      } catch {
        // Handled
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Update order status
 */
export async function updateOrderStatusInDb(orderId: string, status: OrderItem['status']) {
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

/**
 * Create new order
 */
export async function createOrderInDb(order: OrderItem) {
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ORDERS_COLLECTION}/${order.id}`);
  }
}

/**
 * Delete order from Firestore
 */
export async function deleteOrderFromDb(orderId: string) {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ORDERS_COLLECTION}/${orderId}`);
    throw error;
  }
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  mediaType: 'image' | 'video';
  size: number;
  createdAt: string;
}

const MEDIA_COLLECTION = 'media';

let isSeedingMedia = false;
let hasSeededMedia = false;

export async function seedInitialMediaIfNeeded() {
  if (hasSeededMedia || isSeedingMedia) return;
  isSeedingMedia = true;
  try {
    const snap = await getDocs(collection(db, MEDIA_COLLECTION));
    if (snap.empty) {
      const defaultMedia: MediaItem[] = [
        {
          id: 'media-initial-1',
          name: 'The Lawn Mower Ultra Gen 6 - Box Setup',
          url: '/assets/aistudio/30-00006-NA_f201a618.png',
          type: 'image/png',
          mediaType: 'image',
          size: 450000,
          createdAt: '2026-10-21 10:00',
        },
        {
          id: 'media-initial-2',
          name: 'Battery Life & Tutorials',
          url: '/assets/aistudio/25aaeee852d4_1a4c043f.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 280000,
          createdAt: '2026-10-21 10:05',
        },
        {
          id: 'media-initial-3',
          name: 'Trimmer Overview',
          url: '/assets/aistudio/b72c1da980f6_e399d627.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 310000,
          createdAt: '2026-10-21 10:10',
        },
        {
          id: 'media-initial-4',
          name: '100 Minutes Runtime',
          url: '/assets/aistudio/e25de805d015_f449fce7.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 320000,
          createdAt: '2026-10-21 10:15',
        },
        {
          id: 'media-initial-5',
          name: 'Trim Wet or Dry',
          url: '/assets/aistudio/e38aa911b5e9_8252c23e.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 290000,
          createdAt: '2026-10-21 10:20',
        },
        {
          id: 'media-initial-6',
          name: 'What is in the box',
          url: '/assets/aistudio/fac0fd606c51_4d3a1ba2.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 350000,
          createdAt: '2026-10-21 10:25',
        },
        {
          id: 'media-initial-7',
          name: 'Dual-temp LED Spotlight',
          url: '/assets/aistudio/685d42568afa_98fc3951.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 340000,
          createdAt: '2026-10-21 10:30',
        },
        {
          id: 'media-initial-8',
          name: 'Skin-close Shave',
          url: '/assets/aistudio/25106398e899_13ff16c1.webp',
          type: 'image/webp',
          mediaType: 'image',
          size: 330000,
          createdAt: '2026-10-21 10:35',
        },
      ];
      for (const m of defaultMedia) {
        await setDoc(doc(db, MEDIA_COLLECTION, m.id), m);
      }
    }
    hasSeededMedia = true;
  } catch (err: any) {
    if (err?.name === 'AbortError' || String(err?.message || '').toLowerCase().includes('aborted')) {
      return;
    }
    console.warn('Initial media seed note:', err?.message || err);
  } finally {
    isSeedingMedia = false;
  }
}

export function subscribeMedia(
  onData: (media: MediaItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, MEDIA_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: MediaItem[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as MediaItem);
      });
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      onData(items);
    },
    (error) => {
      const msg = String((error as any)?.message || error).toLowerCase();
      if ((error as any)?.name === 'AbortError' || msg.includes('aborted') || msg.includes('signal is aborted')) {
        return;
      }
      try {
        handleFirestoreError(error, OperationType.LIST, MEDIA_COLLECTION);
      } catch {
        // Handled
      }
      if (onError) onError(error);
    }
  );
}

export async function saveMediaToDb(media: MediaItem) {
  try {
    await setDoc(doc(db, MEDIA_COLLECTION, media.id), media);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${MEDIA_COLLECTION}/${media.id}`);
  }
}

export async function deleteMediaFromDb(id: string) {
  try {
    await deleteDoc(doc(db, MEDIA_COLLECTION, id));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MEDIA_COLLECTION}/${id}`);
    throw error;
  }
}
