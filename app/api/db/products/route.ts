import { NextRequest, NextResponse } from 'next/server';
import { getMySQLPool, initMySQLTables, isMySQLConfigured } from '@/lib/mysql';
import { type ProductItem } from '@/config/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({ configured: false, products: [] });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    await initMySQLTables();
    const [rows] = await pool.query('SELECT * FROM products ORDER BY orderIndex ASC, id ASC');
    const products = (rows as any[]).map((r) => ({
      id: r.id,
      orderIndex: r.orderIndex,
      title: r.title,
      subtitle: r.subtitle || '',
      categoryPath: ['Trang chủ', 'PRODUCTS', r.title],
      vipPrice: r.vipPrice || '',
      regularPrice: r.regularPrice || '',
      href: `/products/${r.id}`,
      imageSrc: r.imageSrc,
      imageAlt: r.title,
      thumbnails: typeof r.thumbnails === 'string' ? JSON.parse(r.thumbnails || '[]') : (r.thumbnails || []),
      badge: r.badge || '',
      rating: Number(r.rating) || 5.0,
      reviewCount: r.reviewCount || '1,000+ đánh giá',
      soldCount: r.soldCount || 'Đã bán 50k',
      salesBadge: r.salesBadge || '',
      shortDescription: r.shortDescription || '',
      highlights: typeof r.highlights === 'string' ? JSON.parse(r.highlights || '[]') : (r.highlights || []),
      reviewSample: { author: 'Khách hàng', rating: 5, comment: 'Sản phẩm tuyệt vời.' },
      variants: typeof r.variants === 'string' ? JSON.parse(r.variants || '[]') : (r.variants || []),
      gifts: typeof r.gifts === 'string' ? JSON.parse(r.gifts || '[]') : (r.gifts || []),
      cashbackText: r.cashbackText || '',
      warrantyText: r.warrantyText || '',
      detailedDescription: r.detailedDescription || '',
      videoReviews: typeof r.videoReviews === 'string' ? JSON.parse(r.videoReviews || '[]') : (r.videoReviews || []),
    }));

    return NextResponse.json({ configured: true, products });
  } catch (error: any) {
    console.error('MySQL GET products error:', error);
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
    const product: ProductItem = await req.json();

    const query = `
      INSERT INTO products (
        id, orderIndex, title, subtitle, vipPrice, regularPrice,
        imageSrc, thumbnails, detailedDescription, badge, rating,
        reviewCount, soldCount, salesBadge, shortDescription,
        highlights, variants, gifts, cashbackText, warrantyText, videoReviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        orderIndex = VALUES(orderIndex),
        title = VALUES(title),
        subtitle = VALUES(subtitle),
        vipPrice = VALUES(vipPrice),
        regularPrice = VALUES(regularPrice),
        imageSrc = VALUES(imageSrc),
        thumbnails = VALUES(thumbnails),
        detailedDescription = VALUES(detailedDescription),
        badge = VALUES(badge),
        rating = VALUES(rating),
        reviewCount = VALUES(reviewCount),
        soldCount = VALUES(soldCount),
        salesBadge = VALUES(salesBadge),
        shortDescription = VALUES(shortDescription),
        highlights = VALUES(highlights),
        variants = VALUES(variants),
        gifts = VALUES(gifts),
        cashbackText = VALUES(cashbackText),
        warrantyText = VALUES(warrantyText),
        videoReviews = VALUES(videoReviews);
    `;

    await pool.query(query, [
      product.id,
      product.orderIndex || 0,
      product.title,
      product.subtitle || '',
      product.vipPrice || '',
      product.regularPrice || '',
      product.imageSrc,
      JSON.stringify(product.thumbnails || [product.imageSrc]),
      product.detailedDescription || '',
      product.badge || '',
      product.rating || 5.0,
      product.reviewCount || '1,000+ đánh giá',
      product.soldCount || 'Đã bán 50k',
      product.salesBadge || '',
      product.shortDescription || '',
      JSON.stringify(product.highlights || []),
      JSON.stringify(product.variants || []),
      JSON.stringify(product.gifts || []),
      product.cashbackText || '',
      product.warrantyText || '',
      JSON.stringify(product.videoReviews || []),
    ]);

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('MySQL POST product error:', error);
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

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('MySQL DELETE product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
