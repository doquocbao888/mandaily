import { NextRequest, NextResponse } from 'next/server';
import { getMySQLPool, initMySQLTables, isMySQLConfigured } from '@/lib/mysql';
import { type MediaItem } from '@/lib/dbService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false, media: [] });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    await initMySQLTables();
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

    return NextResponse.json({ configured: true, media });
  } catch (error: any) {
    console.error('MySQL GET media error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await pool.query('DELETE FROM media WHERE id = ?', [id]);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('MySQL DELETE media error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
