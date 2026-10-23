# Version History & Rollback Log

This document tracks major application changes and version releases to enable easy auditing and rollback if needed.

## [v1.8.0] - 2026-10-23
- **Changes:** Fixed React SSR hydration mismatch by migrating CartContext storage synchronization to `useSyncExternalStore`. Replaced modal checkout with dedicated checkout page at `/checkout` matching screenshot `image_a0d5aa08.png`, with COD and VietQR payment methods and Firestore order creation.
- **Files Modified/Created:** `/context/CartContext.tsx`, `/app/checkout/page.tsx`, `/components/cart/CartDrawer.tsx`, `/app/layout.tsx`, `/VERSION_HISTORY.md`

## [v1.7.0] - 2026-10-23
- **Changes:** Created a dedicated checkout page at `/app/checkout/page.tsx` styled after reference screenshot `image_a0d5aa08.png`.
- **Files Created/Modified:** `/app/checkout/page.tsx`, `/components/cart/CartDrawer.tsx`, `/VERSION_HISTORY.md`

## [v1.6.0] - 2026-10-23
- **Changes:** Redesigned Cart Drawer (`CartDrawer`) to precisely match Manscaped's official style (reference screenshots `image_b2373e30.png` and `image_ec27320e.png`).
- **Files Modified:** `/components/cart/CartDrawer.tsx`, `/VERSION_HISTORY.md`

## [v1.5.0] - 2026-10-23
- **Changes:** Implemented fully functional Shopping Cart Drawer (`CartDrawer`) and Checkout Modal (`CheckoutModal`) with COD and VietQR payment methods.
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
