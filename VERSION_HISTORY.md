# Version History & Rollback Log

This document tracks major application changes and version releases to enable easy auditing and rollback if needed.

## [v2.0.0] - 2026-10-23
- **Changes:** Khắc phục triệt để vấn đề mất dữ liệu & trùng lặp khi load lại trang:
  1. Loại bỏ logic tự động khôi phục sản phẩm cũ trong `seedInitialProductsIfNeeded` và `seedInitialOrdersIfNeeded` giúp lưu trữ vĩnh viễn các thao tác Thêm, Sửa, Xóa của Admin trên Cloud Firestore.
  2. Bỏ điều kiện lọc `length > 0` trong các listener `subscribeProducts` và `subscribeOrders` ở cả trang chủ, chi tiết sản phẩm, giỏ hàng và Admin, đảm bảo dữ liệu hiển thị tức thì và đồng bộ 100% khi có bất kỳ thay đổi nào.
  3. Xử lý sản phẩm bị xóa trên trang chi tiết sản phẩm (`/products/[id]`) trả về trạng thái 404 chuẩn thay vì tự động khôi phục dữ liệu mẫu.
- **Files Modified:** `/lib/dbService.ts`, `/components/products/FeaturedProductsSection.tsx`, `/components/products/FeaturedProductsCarousel.tsx`, `/components/products/GoesGreatWithSection.tsx`, `/app/products/[id]/page.tsx`, `/VERSION_HISTORY.md`

## [v1.9.0] - 2026-10-23
- **Changes:** Thêm tính năng xóa đơn hàng trực tiếp trong trang quản trị (`/admin`) với xác nhận cảnh báo an toàn. Đồng bộ xóa thời gian thực với Cloud Firestore (`deleteOrderFromDb`), cập nhật hiển thị tức thì và sửa lỗi listener xóa toàn bộ đơn hàng. Bổ sung nút xóa đơn hàng ở cả tab Tổng quan (Overview) và tab Đơn hàng (Orders).
- **Files Modified:** `/lib/dbService.ts`, `/app/admin/page.tsx`, `/VERSION_HISTORY.md`

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
