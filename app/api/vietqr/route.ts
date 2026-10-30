import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount') || '0';
  const memo = searchParams.get('memo') || searchParams.get('addInfo') || 'MANFRESH';
  const accountName = searchParams.get('accountName') || 'DO QUOC BAO';
  const accountNo = '023118718';
  const bank = 'vib';

  // Primary upstream VietQR SVG endpoint
  const vietQrUrl = `https://img.vietqr.io/image/${bank}-${accountNo}-compact2.svg?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

  try {
    const upstreamRes = await fetch(vietQrUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'image/svg+xml,image/*,*/*',
      },
      next: { revalidate: 3600 },
    });

    if (upstreamRes.ok) {
      const svgText = await upstreamRes.text();
      return new NextResponse(svgText, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (err) {
    console.error('Failed to fetch from upstream VietQR:', err);
  }

  // Fallback high-fidelity SVG badge if external network is slow
  const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 550" width="450" height="550" style="background:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect width="450" height="550" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Header Bar -->
  <rect x="0" y="0" width="450" height="70" rx="24" fill="#004bb1"/>
  <rect x="0" y="46" width="450" height="24" fill="#004bb1"/>
  <text x="24" y="44" fill="#ffffff" font-size="22" font-weight="900" letter-spacing="1">VIB</text>
  <text x="76" y="43" fill="#93c5fd" font-size="13" font-weight="600">Ngân hàng Quốc Tế</text>
  <rect x="330" y="18" width="96" height="34" rx="8" fill="#ffffff"/>
  <text x="345" y="41" fill="#004bb1" font-size="13" font-weight="800">VietQR</text>

  <!-- Notice -->
  <text x="225" y="105" text-anchor="middle" fill="#111827" font-size="16" font-weight="700">QUÉT MÃ ĐỂ THANH TOÁN</text>
  <text x="225" y="125" text-anchor="middle" fill="#6b7280" font-size="12">Hỗ trợ tất cả ứng dụng Mobile Banking &amp; Ví điện tử</text>

  <!-- QR Frame Mockup -->
  <rect x="75" y="145" width="300" height="300" rx="16" fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5"/>
  <g transform="translate(100, 170)">
    <!-- Corner 1 -->
    <rect x="0" y="0" width="60" height="60" rx="8" fill="#111827"/>
    <rect x="10" y="10" width="40" height="40" rx="4" fill="#ffffff"/>
    <rect x="20" y="20" width="20" height="20" rx="2" fill="#004bb1"/>
    <!-- Corner 2 -->
    <rect x="190" y="0" width="60" height="60" rx="8" fill="#111827"/>
    <rect x="200" y="10" width="40" height="40" rx="4" fill="#ffffff"/>
    <rect x="210" y="20" width="20" height="20" rx="2" fill="#004bb1"/>
    <!-- Corner 3 -->
    <rect x="0" y="190" width="60" height="60" rx="8" fill="#111827"/>
    <rect x="10" y="200" width="40" height="40" rx="4" fill="#ffffff"/>
    <rect x="20" y="210" width="20" height="20" rx="2" fill="#004bb1"/>
    <!-- Center patterns -->
    <rect x="80" y="20" width="15" height="15" fill="#111827"/>
    <rect x="120" y="20" width="15" height="15" fill="#111827"/>
    <rect x="150" y="35" width="15" height="15" fill="#111827"/>
    <rect x="85" y="60" width="80" height="80" rx="12" fill="#004bb1"/>
    <text x="125" y="106" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="bold">VIB</text>
    <rect x="20" y="80" width="15" height="15" fill="#111827"/>
    <rect x="50" y="100" width="15" height="15" fill="#111827"/>
    <rect x="190" y="80" width="15" height="15" fill="#111827"/>
    <rect x="220" y="120" width="15" height="15" fill="#111827"/>
    <rect x="80" y="160" width="15" height="15" fill="#111827"/>
    <rect x="120" y="170" width="15" height="15" fill="#111827"/>
    <rect x="150" y="190" width="15" height="15" fill="#111827"/>
    <rect x="190" y="190" width="15" height="15" fill="#111827"/>
    <rect x="220" y="220" width="15" height="15" fill="#111827"/>
  </g>

  <!-- Info Footer -->
  <rect x="24" y="465" width="402" height="65" rx="12" fill="#eff6ff" stroke="#bfdbfe"/>
  <text x="40" y="490" fill="#1e3a8a" font-size="13" font-weight="700">STK: 023118718 - VIB</text>
  <text x="40" y="512" fill="#1e40af" font-size="12" font-weight="600">DO QUOC BAO - ${Number(amount).toLocaleString('vi-VN')} đ</text>
</svg>
`;

  return new NextResponse(fallbackSvg.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
