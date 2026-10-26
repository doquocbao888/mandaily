import { NextResponse } from 'next/server';
import { getMySQLPool, initMySQLTables, isMySQLConfigured } from '@/lib/mysql';

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
    const initialized = await initMySQLTables();

    return NextResponse.json({
      configured: true,
      connected: true,
      tablesInitialized: initialized,
      database: process.env.MYSQL_DATABASE || 'u762924426_manfresh_db',
      host: process.env.MYSQL_HOST,
      testResult: rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: error?.message || String(error),
      code: error?.code,
    }, { status: 500 });
  }
}
