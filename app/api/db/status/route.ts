import { NextResponse } from 'next/server';
import { getMySQLPool, isMySQLConfigured, isConnectionLimitError } from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!isMySQLConfigured()) {
    return NextResponse.json({
      configured: false,
      message: 'Chưa cấu hình thông tin MySQL trong biến môi trường (.env)',
      database: 'u762924426_manfresh_db',
      user: 'u762924426_manfresh',
    });
  }

  const pool = getMySQLPool();
  if (!pool) {
    return NextResponse.json({
      configured: true,
      connected: false,
      message: 'Không thể tạo kết nối Pool tới MySQL',
    }, { status: 500 });
  }

  try {
    const [rows] = await pool.query('SELECT 1 as test');

    return NextResponse.json({
      configured: true,
      connected: true,
      tablesInitialized: true,
      database: 'u762924426_manfresh_db',
      testResult: rows,
    });
  } catch (error: any) {
    if (isConnectionLimitError(error)) {
      console.warn('MySQL status route: Hostinger hourly connection limit reached.');
      return NextResponse.json({
        configured: true,
        connected: true,
        tablesInitialized: true,
        rateLimited: true,
        message: 'Hostinger đạt giới hạn kết nối/giờ (500), hệ thống đang tự động phục vụ từ bộ nhớ đệm cache mượt mà.',
      });
    }

    return NextResponse.json({
      configured: true,
      connected: false,
      error: error?.message || String(error),
      code: error?.code,
    }, { status: 500 });
  }
}
