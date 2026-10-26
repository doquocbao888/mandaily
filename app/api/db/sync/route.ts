import { NextResponse } from 'next/server';
import { getMySQLPool, initMySQLTables, isMySQLConfigured } from '@/lib/mysql';
import { featuredProductsConfig2 } from '@/config/products';

export async function POST() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({
      configured: false,
      message: 'Chưa cấu hình thông tin MySQL trong biến môi trường (.env)',
    }, { status: 400 });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database pool unavailable' }, { status: 500 });
  }

  try {
    await initMySQLTables();

    // Check existing products count
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
    const count = (rows as any[])[0]?.count || 0;

    let inserted = 0;
    for (let i = 0; i < featuredProductsConfig2.products.length; i++) {
      const prod = featuredProductsConfig2.products[i];
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
          subtitle = VALUES(subtitle);
      `;

      await pool.query(query, [
        prod.id,
        i,
        prod.title,
        prod.subtitle || '',
        prod.vipPrice || '',
        prod.regularPrice || '',
        prod.imageSrc,
        JSON.stringify(prod.thumbnails || [prod.imageSrc]),
        prod.detailedDescription || '',
        prod.badge || '',
        prod.rating || 5.0,
        prod.reviewCount || '1,000+ đánh giá',
        prod.soldCount || 'Đã bán 50k',
        prod.salesBadge || '',
        prod.shortDescription || '',
        JSON.stringify(prod.highlights || []),
        JSON.stringify(prod.variants || []),
        JSON.stringify(prod.gifts || []),
        prod.cashbackText || '',
        prod.warrantyText || '',
        JSON.stringify(prod.videoReviews || []),
      ]);
      inserted++;
    }

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ thành công ${inserted} sản phẩm sang Hostinger MySQL`,
      previousCount: count,
      newCount: inserted,
    });
  } catch (error: any) {
    console.error('MySQL Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
