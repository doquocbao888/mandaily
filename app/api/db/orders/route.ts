import { NextRequest, NextResponse } from 'next/server';
import {
  getMySQLPool,
  initMySQLTables,
  isMySQLConfigured,
  getCachedData,
  setCachedData,
  invalidateCache,
  isConnectionLimitError,
} from '@/lib/mysql';
import { type OrderItem } from '@/lib/dbService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false, orders: [] });
  }

  // 1. Check in-memory cache first to avoid exhausting Hostinger connection limits
  const cached = getCachedData<OrderItem[]>('orders', 15000);
  if (cached) {
    return NextResponse.json({ configured: true, orders: cached, cached: true });
  }

  const pool = getMySQLPool();
  if (!pool) {
    const fallback = getCachedData<OrderItem[]>('orders', 3600000) || [];
    return NextResponse.json({ configured: true, orders: fallback, fallback: true });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY createdAtTimestamp DESC, id DESC');
    const orders = (rows as any[]).map((r) => ({
      id: r.id,
      customerName: r.customerName,
      phone: r.phone,
      address: r.address,
      productName: r.productName,
      variant: r.variant || 'Standard',
      quantity: Number(r.quantity) || 1,
      totalPrice: r.totalPrice,
      status: r.status,
      paymentMethod: r.paymentMethod,
      notes: r.notes || '',
      discountCode: r.discountCode || '',
      discountAmount: r.discountAmount || '',
      createdAt: r.createdAt,
    }));

    setCachedData('orders', orders);
    return NextResponse.json({ configured: true, orders });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL GET orders rate-limited on Hostinger, serving cached/local orders.');
      const fallback = getCachedData<OrderItem[]>('orders', 3600000) || [];
      return NextResponse.json({
        configured: true,
        orders: fallback,
        rateLimited: true,
        cached: true,
      });
    }

    console.warn('MySQL GET orders warning:', error?.message || error);
    const fallback = getCachedData<OrderItem[]>('orders', 3600000) || [];
    return NextResponse.json({ configured: true, orders: fallback, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false, error: 'MySQL not configured' }, { status: 400 });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    await initMySQLTables();
    const order: OrderItem = await req.json();

    const query = `
      INSERT INTO orders (
        id, customerName, phone, address, productName, variant,
        quantity, totalPrice, status, paymentMethod, notes,
        discountCode, discountAmount, createdAt, createdAtTimestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        customerName = VALUES(customerName),
        phone = VALUES(phone),
        address = VALUES(address),
        productName = VALUES(productName),
        variant = VALUES(variant),
        quantity = VALUES(quantity),
        totalPrice = VALUES(totalPrice),
        status = VALUES(status),
        paymentMethod = VALUES(paymentMethod),
        notes = VALUES(notes),
        discountCode = VALUES(discountCode),
        discountAmount = VALUES(discountAmount);
    `;

    const timestamp = Date.now();
    await pool.query(query, [
      order.id,
      order.customerName,
      order.phone,
      order.address,
      order.productName,
      order.variant || 'Standard',
      order.quantity || 1,
      order.totalPrice,
      order.status || 'Đang xử lý',
      order.paymentMethod || 'COD',
      order.notes || '',
      order.discountCode || '',
      order.discountAmount || '',
      order.createdAt || new Date().toLocaleString('vi-VN'),
      timestamp,
    ]);

    invalidateCache('orders');
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL POST order: Hostinger connection limit reached.');
      return NextResponse.json(
        { error: 'Hostinger database đang bận (vượt giới hạn kết nối/giờ). Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }
    console.error('MySQL POST order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false }, { status: 400 });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    invalidateCache('orders');
    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL PUT order: Hostinger connection limit reached.');
      return NextResponse.json(
        { error: 'Hostinger database đang bận. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }
    console.error('MySQL PUT order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false }, { status: 400 });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    invalidateCache('orders');
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL DELETE order: Hostinger connection limit reached.');
      return NextResponse.json(
        { error: 'Hostinger database đang bận. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }
    console.error('MySQL DELETE order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
