# Lịch sử Phiên bản Dự án (Version History & Checkpoints)

Tài liệu này ghi lại các mốc phiên bản quan trọng của dự án để đảm bảo an toàn, dễ dàng kiểm tra và phục hồi khi cần thiết.

## 📌 v1.0.6 - Hoàn thiện carousel trượt 3 thẻ với tiêu đề và mô tả riêng cho từng thẻ
- **Thời gian**: Tháng 10/2026
- **Trạng thái**: Build thành công (`Build succeeded`).
- **Nội dung**: Cập nhật `GameChangingTechSection` sao cho mỗi thẻ card đều có tiêu đề và mô tả hiển thị trực tiếp bên dưới chính thẻ đó, đồng thời hỗ trợ trượt ngang mượt mà (peek carousel layout) đúng theo yêu cầu và hình ảnh mẫu (`image_b136165e.png`, `image_6a39c38a.png`).

## 📌 v1.0.5 - Cải tiến hiệu ứng trượt carousel (Peek Layout) cho Game-Changing Tech

## 📌 v1.0.4 - Triển khai phần Game-Changing Tech (Giao diện 3 thẻ tính năng công nghệ)
- **Thời gian**: Tháng 10/2026
- **Trạng thái**: Build thành công (`Build succeeded`).
- **Nội dung**: Thêm thành phần `GameChangingTechSection` dựa trên các ảnh mẫu và screenshot cung cấp (`image_c7385247.png`, `homepage-superbowl_spotlight-gallery_1-motors-cover_desktop_cdbcdc42.jpg`, v.v.), bao gồm tiêu đề "MADE FOR YOU / Game-changing tech.", 3 thẻ thẻ card nổi bật (Motors, SkinSafe, Waterproof) với thẻ sản phẩm thả nổi (Floating Product Pill) và cụm điều hướng carousel.

## 📌 v1.0.3 - Hoàn tác vị trí ProductSpotlightSection theo yêu cầu quay lại
- **Thời gian**: Tháng 10/2026
- **Trạng thái**: Build thành công (`Build succeeded`).
- **Nội dung**: Hoàn tác việc thay đổi vị trí `ProductSpotlightSection`, đưa `TrustBar` quay lại ngay dưới HeroSection như trước.

## 📌 v1.0.2 - Thêm Gen6HighlightSection
- **Thời gian**: Tháng 10/2026
- **Trạng thái**: Build thành công (`Build succeeded`).
- **Nội dung**: Thêm `Gen6HighlightSection` ngay dưới HeroSection.

## 📌 v1.0.1 - Cập nhật Hero Section (Performance Package)TRA GEN 6", sử dụng ảnh nền `the-performance-package-6_product_desktop_401c846d.jpg`, bao gồm badge "NEW!" và nút CTA "Shop now".

## 📌 v1.0.0 - Hoàn thiện toàn bộ các phần theo yêu cầu (Cũ)
- **Thời gian**: Tháng 10/2026
- **Trạng thái**: Build thành công (`Build succeeded`).
- **Các thành phần đã triển khai**:
  1. **Super Banner / Announcement Bar**: Banner thông báo phía trên cùng (chữ thực, nền ảnh `formulations_superbanner_desktop_50d901d4.jpg`).
  2. **Main Header / Navigation**: Thanh điều hướng chính với thanh đen phía trên (Support, Track Order, Unlock Rewards, Sale, EN) và thanh trắng phía dưới (Logo MANSCAPED căn giữa, danh mục Male Grooming, Manscaped Lab, Deals & Kits, Quiz, các icon Search, Account, ShoppingBag với badge số lượng).
  3. **Hero Section (Mosaic Tiles)**: Các khối hình ảnh mosaic tile chuẩn xác tỷ lệ theo các file ảnh đã cung cấp.
  4. **Trust Bar**: Thanh cam kết chất lượng.
  5. **Featured Products Section**: Phần sản phẩm nổi bật với dòng chữ "Take it up a crotch.".
  6. **Category Carousel Section**: Khối danh mục kéo trượt (carousel) từ đầu đến chân.
  7. **Product Spotlight Section**: Phần spotlight sản phẩm (The Lawn Mower Ultra Gen 6).

---

## 📌 v0.9.0 - Chỉ có Super Banner (Phiên bản trước Header)
- **Trạng thái**: Chỉ hiển thị Super Banner đầu trang.
- **File chính**: `/components/header/SuperBanner.tsx`, `/app/page.tsx` (chỉ gọi SuperBanner).

---
*Ghi chú: Mọi thay đổi tiếp theo sẽ được cập nhật liên tục vào danh sách này.*
