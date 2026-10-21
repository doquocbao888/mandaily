import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Pixel-Perfect UI Builder',
  description: 'Tái tạo giao diện website chính xác từ screenshot và thiết kế tham chiếu bằng Next.js và Tailwind CSS.',
  openGraph: {
    title: 'Pixel-Perfect UI Builder',
    description: 'Tái tạo giao diện website chính xác từ screenshot và thiết kế tham chiếu bằng Next.js và Tailwind CSS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pixel-Perfect UI Builder',
    description: 'Tái tạo giao diện website chính xác từ screenshot và thiết kế tham chiếu bằng Next.js và Tailwind CSS.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
