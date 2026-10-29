import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import ClientErrorGuard from '@/components/ClientErrorGuard';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MANFRESH Vietnam | Đẳng Cấp Chăm Sóc Phái Mạnh & Tông Đơ SkinSafe™',
  description: 'Thương hiệu chăm sóc nam giới số 1. Dụng cụ cạo lông SkinSafe™, chống nước IPX7, giao hàng hỏa tốc và bảo hành chính hãng 2 năm.',
  openGraph: {
    title: 'MANFRESH Vietnam | Đẳng Cấp Chăm Sóc Phái Mạnh & Tông Đơ SkinSafe™',
    description: 'Thương hiệu chăm sóc nam giới số 1. Dụng cụ cạo lông SkinSafe™, chống nước IPX7, giao hàng hỏa tốc và bảo hành chính hãng 2 năm.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANFRESH Vietnam | Đẳng Cấp Chăm Sóc Phái Mạnh & Tông Đơ SkinSafe™',
    description: 'Thương hiệu chăm sóc nam giới số 1. Dụng cụ cạo lông SkinSafe™, chống nước IPX7, giao hàng hỏa tốc và bảo hành chính hãng 2 năm.',
  },
};

import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingSupportWidget from '@/components/common/FloatingSupportWidget';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={plusJakartaSans.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function shouldSuppress(err, msg) {
                  var m = (msg || '').toLowerCase();
                  var n = (err && err.name) ? String(err.name) : '';
                  var reasonStr = (err && (err.message || String(err))) ? String(err.message || err).toLowerCase() : '';
                  return n === 'AbortError' ||
                    n === 'NotAllowedError' ||
                    m.indexOf('signal is aborted') !== -1 ||
                    m.indexOf('aborterror') !== -1 ||
                    m.indexOf('write permission denied') !== -1 ||
                    m.indexOf("failed to execute 'writetext'") !== -1 ||
                    m.indexOf('clipboard') !== -1 ||
                    m.indexOf('aborted') !== -1 ||
                    reasonStr.indexOf('signal is aborted') !== -1 ||
                    reasonStr.indexOf('aborterror') !== -1 ||
                    reasonStr.indexOf('write permission denied') !== -1;
                }

                window.addEventListener('unhandledrejection', function(event) {
                  var reason = event ? event.reason : null;
                  var msg = reason ? (reason.message || String(reason)) : '';
                  if (shouldSuppress(reason, msg)) {
                    event.preventDefault();
                    if (event.stopPropagation) event.stopPropagation();
                    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                    return true;
                  }
                }, true);

                window.addEventListener('error', function(event) {
                  var err = event ? event.error : null;
                  var msg = (event && event.message) ? event.message : (err ? err.message : '');
                  if (shouldSuppress(err, msg)) {
                    event.preventDefault();
                    if (event.stopPropagation) event.stopPropagation();
                    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                    return true;
                  }
                }, true);

                var origConsoleError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var text = args.map(function(a) {
                    return (a && a.message) ? a.message : String(a || '');
                  }).join(' ').toLowerCase();
                  if (
                    text.indexOf('signal is aborted') !== -1 ||
                    text.indexOf('aborterror') !== -1 ||
                    text.indexOf('write permission denied') !== -1
                  ) {
                    return;
                  }
                  origConsoleError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ClientErrorGuard />
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingSupportWidget />
        </CartProvider>
      </body>
    </html>
  );
}
