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
import { type MediaItem } from '@/lib/dbService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false, media: [] });
  }

  // Check in-memory cache first
  const cached = getCachedData<MediaItem[]>('media', 15000);
  if (cached) {
    return NextResponse.json({ configured: true, media: cached, cached: true });
  }

  const pool = getMySQLPool();
  if (!pool) {
    const fallback = getCachedData<MediaItem[]>('media', 3600000) || [];
    return NextResponse.json({ configured: true, media: fallback, fallback: true });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM media ORDER BY createdAt DESC, id DESC');
    const media = (rows as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      url: r.url,
      type: r.type,
      mediaType: r.mediaType || 'image',
      size: Number(r.size) || 0,
      createdAt: r.createdAt,
    }));

    setCachedData('media', media);
    return NextResponse.json({ configured: true, media });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL GET media rate-limited on Hostinger, serving cached/local media.');
      const fallback = getCachedData<MediaItem[]>('media', 3600000) || [];
      return NextResponse.json({
        configured: true,
        media: fallback,
        rateLimited: true,
        cached: true,
      });
    }

    console.warn('MySQL GET media warning:', error?.message || error);
    const fallback = getCachedData<MediaItem[]>('media', 3600000) || [];
    return NextResponse.json({ configured: true, media: fallback, fallback: true });
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
    const item: MediaItem = await req.json();

    const query = `
      INSERT INTO media (id, name, url, type, mediaType, size, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        url = VALUES(url),
        type = VALUES(type),
        mediaType = VALUES(mediaType),
        size = VALUES(size);
    `;

    await pool.query(query, [
      item.id,
      item.name,
      item.url,
      item.type,
      item.mediaType || 'image',
      item.size || 0,
      item.createdAt || new Date().toLocaleString('vi-VN'),
    ]);

    invalidateCache('media');
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL POST media: Hostinger connection limit reached.');
      return NextResponse.json(
        { error: 'Hostinger database đang bận (vượt giới hạn kết nối/giờ). Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }
    console.error('MySQL POST media error:', error);
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

    await pool.query('DELETE FROM media WHERE id = ?', [id]);
    invalidateCache('media');
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL DELETE media: Hostinger connection limit reached.');
      return NextResponse.json(
        { error: 'Hostinger database đang bận (vượt giới hạn kết nối/giờ). Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }
    console.error('MySQL DELETE media error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
