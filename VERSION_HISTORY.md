# Version History & Rollback Log

This document tracks major application changes and version releases to enable easy auditing and rollback if needed.

## [v1.5.0] - 2026-10-23
- **Changes:** Implemented fully functional Shopping Cart Drawer (`CartDrawer`) and Checkout Modal (`CheckoutModal`) with two payment methods: **COD (Thanh toán khi nhận hàng)** and **Chuyển khoản VietQR** (with bank info, amount, transfer memo, and copy buttons). Integrated with Firestore order creation and Header cart badge.
- **Files Created/Modified:** `/context/CartContext.tsx`, `/components/cart/CartDrawer.tsx`, `/components/cart/CheckoutModal.tsx`, `/components/header/Header.tsx`, `/app/layout.tsx`, `/app/products/[id]/page.tsx`, `/VERSION_HISTORY.md`

## [v1.4.0] - 2026-10-23
- **Changes:** Added 4-video Video Reviews section to the homepage (`app/page.tsx`) right above the footer.
- **Files Modified:** `/app/page.tsx`

## [v1.3.0] - 2026-10-23
- **Changes:** Removed white background (`bg-white`) from `VideoReviewsSection` and `GoesGreatWithSection`.
- **Files Modified:** `/components/products/VideoReviewsSection.tsx`, `/components/products/GoesGreatWithSection.tsx`

## [v1.2.0] - 2026-10-23
- **Changes:** Created and integrated `ProductFaqSection` accordion component matching screenshot `image_e2b72496.png`.
- **Files Modified:** `/components/products/ProductFaqSection.tsx`, `/app/products/[id]/page.tsx`

## [v1.1.0] - 2026-10-23
- **Changes:** Created unified pill navigation button component (`CarouselPillNavigation.tsx`) matching reference design.
- **Files Modified:** `/components/common/CarouselPillNavigation.tsx`

## [v1.0.0] - Initial Release
- **Changes:** Initial Pixel-Perfect UI build of Manscaped store clone with Next.js, Tailwind CSS, Firestore database integration.
