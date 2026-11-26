# Website Trình Chiếu — LẠC HỒNG SỐ (Nghị quyết 57-NQ/TW · Cụm 1)

Website trình chiếu tương tác 7 giai đoạn phục vụ phần thuyết trình bộ 05 ấn phẩm **LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1** tại **Trại Thanh niên số thành phố Đồng Nai năm 2026** (Mục 2 – Thiết kế, Chủ đề 1: *Nghị quyết đến gần thanh niên*).

---

## 1. Đường dẫn trực tuyến & Kho mã nguồn

- **Website trình chiếu trực tuyến (GitHub Pages):**  
  `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/`
- **Kho mã nguồn độc lập (GitHub):**  
  `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1`
- **Toàn văn Nghị quyết 57-NQ/TW đối chiếu chính thức (Bộ KH&CN):**  
  `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm`

> **Lưu ý tách biệt dự án gốc (Zero Overwrite):**  
> Dự án **LẠC HỒNG SỐ** vận hành trên thư mục và kho Git **hoàn toàn độc lập** (`lovemvaf/lac-hong-so-nghiquyet57-cum1`). Kho lưu trữ và website gốc của dự án *“Nét vẽ tri ân – Một dòng code, vạn chân trời”* (`lovemvaf/net-ve-tri-an-dntu-2026` · `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`) đã được khôi phục nguyên trạng bản **V10 (20/11)** và tuyệt đối không bị ghi đè.

---

## 2. Cấu trúc mạch trình chiếu 7 giai đoạn

| Giai đoạn | Tên màn hình | Nội dung chính |
|---|---|---|
| **Stage 0** | `Mở đầu` (`#stage-landing`) | Huy hiệu Đoàn nguyên bản, họa tiết **Trống đồng Đông Sơn** vector 16 tia mặt trời & vòng Chim Lạc, tổng quan chiến dịch **LẠC HỒNG SỐ**, 05 thẻ xem trước ấn phẩm (bấm để nhảy nhanh), nút CTA **Khám phá bộ 05 ấn phẩm →**. |
| **Stage 1** | `01 / 05` (`01_KhoiNguonNhanThuc.png`) | **KHỞI NGUỒN NHẬN THỨC** — *NGHỊ QUYẾT 57 GẦN THANH NIÊN THẾ NÀO?* |
| **Stage 2** | `02 / 05` (`02_HieuDungNoiDung.png`) | **HIỂU ĐÚNG NỘI DUNG** — *HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG* (3 nội dung gợi nhớ cốt lõi). |
| **Stage 3** | `03 / 05` (`03_HanhDongThietThuc.png`) | **HÀNH ĐỘNG THIẾT THỰC** — *THANH NIÊN HÀNH ĐỘNG* (Gợi ý phần việc Cụm 1 tại cơ sở). |
| **Stage 4** | `04 / 05` (`04_LanToaCongDong.png`) | **LAN TỎA TRONG CỘNG ĐỒNG** — *TỪ MỘT NGƯỜI ĐẾN CẢ CỘNG ĐỒNG* |
| **Stage 5** | `05 / 05` (`05_KhatVongLacHongSo.png`) | **KHÁT VỌNG LẠC HỒNG SỐ** — *HIỂU ĐÚNG – LÀM THẬT – LAN TỎA* + mã QR thật & nút mở toàn văn `mst.gov.vn`. |
| **Stage 6** | `Tổng kết` (`#stage-finale`) | Thư viện thu nhỏ 05 ấn phẩm (nhấp để phóng to Lightbox), mã QR động trỏ về `mst.gov.vn`, nút đọc toàn văn & quay lại từ đầu. |

- Toàn bộ poster hiển thị nguyên vẹn tỷ lệ **`1080 × 1350` (`object-fit: contain`)**, không cắt xén chữ, Huy hiệu Đoàn hay chân trang trên cả màn hình máy chiếu `1920×1080`, laptop `1366×768` và điện thoại `390×844`.
- **Không** có bảng debug/overlay kỹ thuật trên giao diện sản phẩm; **không** tự phát âm thanh; **100%** font **Be Vietnam Pro** đóng gói cục bộ chạy mượt cả khi ngoại tuyến (offline).

---

## 3. Phím tắt & Thao tác trình bày trực tiếp

| Phím / Nút trên HUD | Tác dụng |
|---|---|
| `→` (`ArrowRight`) / `Space` / **Tiếp ›** | Chuyển sang giai đoạn tiếp theo (`Mở đầu → 01 → 02 → 03 → 04 → 05 → Tổng kết`). |
| `←` (`ArrowLeft`) / **‹ Trước** | Lùi về giai đoạn trước đó. |
| `Home` / `R` / **Về đầu (R)** | Quay tức thì về màn hình Mở đầu (`Stage 0`). |
| `End` | Chuyển nhanh đến màn hình Tổng kết (`Stage 6`). |
| `N` / **Lời dẫn (N)** | Bật/tắt khung **Lời dẫn thuyết trình** tương ứng từng giai đoạn. |
| `Z` / **Phóng to (Z)** / Nhấp vào poster | Mở hộp thoại **Lightbox độ phân giải gốc** (trong Lightbox dùng `←` / `→` để lướt giữa 05 poster, `Esc` hoặc `Z` để đóng). |
| `L` / **Chế độ nhẹ (L)** | Bật/tắt **Chế độ nhẹ** (tạm dừng hoạt ảnh canvas Chim Lạc & hiệu ứng chuyển cảnh GSAP cho máy cấu hình thấp hoặc người nhạy cảm chuyển động). |
| `F` / **Toàn màn hình (F)** | Bật/tắt chế độ trình chiếu toàn màn hình trên máy tính/máy chiếu. |

### Gợi ý nhịp thuyết trình sáng 27/11/2026 (tối đa 06 phút trình bày + 04 phút phản biện)
1. **0:00 – 0:45 (`Mở đầu`):** Giới thiệu khái niệm **LẠC HỒNG SỐ** và mạch 3 bước *Hiểu đúng – Làm thật – Lan tỏa giá trị số*.
2. **0:45 – 4:45 (`01/05` → `05/05`):** Mỗi ấn phẩm dành ~45–50 giây, bấm `N` nếu cần xem nhanh gợi ý lời dẫn và bấm `Z` phóng to khi ban giám khảo cần soi chi tiết đồ họa/mã QR.
3. **4:45 – 5:30 (`Tổng kết`):** Nhấn mạnh QR đối chiếu trực tiếp toàn văn Nghị quyết 57-NQ/TW tại `mst.gov.vn` và tuyên bố minh bạch sử dụng công cụ AI hỗ trợ minh họa 2D.

---

## 4. Chạy cục bộ, Build và Kiểm định tự động

Yêu cầu môi trường: **Node.js >= 20**, **pnpm** (hoặc **npm**).

```bash
# 1. Di chuyển vào thư mục dự án độc lập
cd lac-hong-so-nghiquyet57-cum1

# 2. Cài đặt phụ thuộc (nếu chưa cài)
pnpm install

# 3. Chạy máy chủ trình chiếu cục bộ (Vite)
# Truy cập: http://127.0.0.1:5174/lac-hong-so-nghiquyet57-cum1/
pnpm run dev

# 4. Đóng gói bản dựng tĩnh (./dist) và xem thử bản build
pnpm run build
pnpm run preview

# 5. Kiểm định bộ 05 ấn phẩm PNG/SVG & giải mã pixel QR thật (131 tiêu chí)
npm run qa:posters

# 6. Chạy bộ kiểm thử E2E Playwright (1920x1080, 1366x768, 390x844)
pnpm test
```
