# KIỂM ĐỊNH GIAO DIỆN & HIỂN THỊ ĐA MÀN HÌNH (`WEB_VISUAL_QA.md`)

- **Sản phẩm kiểm định:** Website trình chiếu tương tác 7 giai đoạn **LẠC HỒNG SỐ** (`Vite 8.3.8` + `Reveal.js 6.0.2` + `GSAP 3.15.1` + `Canvas 2D` + `@fontsource/be-vietnam-pro`)
- **Bộ kiểm thử tự động:** `tests/lac_hong_so.spec.js` — **`4 passed, 0 failed, 0 skipped`** (`1.2m`)
- **Ảnh chụp đối chiếu:**
  - Trước nâng cấp (V1): [LacHongSo_Cum1_NQ57_2026/qa/before_v1/](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/before_v1/)
  - Sau nâng cấp (V2): [LacHongSo_Cum1_NQ57_2026/qa/screenshots/](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/screenshots/)

---

## 1. So sánh nâng cấp giao diện & nội dung: V1 vs. V2

| Hạng mục | Bản V1 (`before_v1/` · tag `v1-pre-sync`) | Bản V2 (hiện tại · `campaign-content.json` SSOT) |
|---|---|---|
| **05 Ấn phẩm trình chiếu** | Tên tệp cũ `01_KhoiNguonNhanThuc.png`..`05_KhatVongLacHongSo.png` | Tên tệp chuẩn `01_dat_cau_hoi_1080x1350.png`..`05_lan_toa_1080x1350.png`, khớp 100% SVG/PNG mới và tranh `03_vision_2030_2045_raw.png`. |
| **Giai đoạn 3 (`2030 → 2045`)** | Chỉ có đoạn tóm tắt chữ và motif SVG | Hiển thị tự động khối tương phản cao **`#panel-policy-highlights`** (không cần bấm thêm) với 2 thẻ số liệu `2030` / `2045` tĩnh hoàn toàn + dải cảnh báo **`MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)`**. |
| **Giai đoạn 2 & 4 + đồng bộ Video** | Chưa tách badge phân loại claim | Hiển thị `#panel-fact-chips` kèm nhãn `Định hướng NQ57` / `Đề xuất Cụm 1` và thẻ `#panel-video-chip` đồng bộ nhịp `SHORT 1`–`SHORT 5`. |
| **Tra cứu & Tải ấn phẩm** | Chỉ có Lightbox phóng to | Bổ sung nút **`Tải PNG`** (`a#btn-download-poster` & `a#btn-lightbox-download`) và hộp thoại **`Nguồn & 7NV (I)`** (`#sources-modal`: 7 nhiệm vụ chia 4 trụ, 5 câu hỏi đánh giá, link `chinhphu.vn` / `mst.gov.vn` / `03/NQ-CP` / `71/NQ-CP`, `conceptNotice`). |
| **Màn hình Tổng kết & QR** | QR trỏ về `mst.gov.vn` | QR động (`shape-rendering: crispEdges`) + nút chính **`chinhphu.vn`**, giữ thêm link đối chiếu **`mst.gov.vn`**. |

---

## 2. Kết quả kiểm tra trực quan đa khung hình (`1920×1080`, `1366×768`, `390×844`)

| Viewport | Màn hình đã kiểm định trực quan qua `read_file` | Đo hình học & Trạng thái hiển thị |
|---|---|---|
| **`1920 × 1080`** *(Máy chiếu / Desktop)* | `landing_1920x1080.png`, `scene_01`..`05_1920x1080.png`, `scene_03_zoom_1920x1080.png`, `sources_modal_1920x1080.png`, `finale_1920x1080.png` | Toàn bộ Stage 0, 5 ấn phẩm `1080×1350 contain`, bảng bên phải (gồm `#panel-policy-highlights` trên Stage 3), Lightbox `Z`, Modal `I` và Stage 6 Finale đều nằm gọn trên một màn hình phía trên `#hud-bar` (`cardScrollH <= cardClientH`, `frameRect.bottom <= hudRect.top`, zero clipping). |
| **`1366 × 768`** *(Laptop phổ thông)* | `landing_1366x768.png`, `scene_03_1366x768.png`, `finale_1366x768.png` | Landing & Finale vừa khít 100% phía trên HUD (`scrollHeight <= clientHeight`, QR & 5 thumbnail không bị cắt). Trên Stage 1–5, poster `1080×1350` giữ nguyên `object-fit: contain` không cắt góc/chân trang; bảng `#panel-policy-highlights` hiển thị trọn vẹn ngay vùng nhìn đầu tiên của `.editorial-panel` (phần motif & lời dẫn cuộn mượt bên trong bảng nếu cần). |
| **`390 × 844`** *(Di động dọc)* | `landing_390x844.png`, `scene_03_390x844.png`, `scene_05_390x844.png` | Trình duyệt bật `overflow-y: auto`, tràn ngang `scrollWidth <= 390 px` trên cả 7 giai đoạn; poster giữ trọn khung `4:5` + nút `Phóng to (Z)` và `Tải PNG`; trên Stage 3 `#panel-policy-highlights` xếp 1 cột dễ đọc; Finale đủ 5 thẻ ảnh + QR + 2 link chính thống. |
| **`prefers-reduced-motion: reduce`** | Kiểm thử tự động Test 4 | Tự động bật `Chế độ nhẹ (L)` khi tải trang (`isLiteMode = true`, `body.lite-mode`, Trống đồng `#landing-dong-son-svg` `animationPlayState = paused`), chuyển trang tức thì không giật. |

---

## 3. Lỗi bố cục phát hiện & đã khắc phục ngay trong QA

Khi mở kiểm tra trực quan các ảnh chụp đầu tiên của V2 via `read_file`, QA phát hiện 2 điểm cần tinh chỉnh ở khung hẹp và đã sửa trực tiếp trong [src/styles/main.css](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/src/styles/main.css):
1. **HUD 390px bị rớt dòng thứ 3:** Sau khi V2 thêm nút `Nguồn & 7NV (I)` vào thanh HUD, nút `Chế độ nhẹ (L)` bị rớt xuống hàng thứ 3 và nút `Mở đầu` trong dải điều hướng `.stage-pills-nav` bị ngắt thành 2 dòng. **Khắc phục:** Trong `@media (max-width: 640px)`, điều chỉnh lưới `.stage-pills-nav` (`1.45fr repeat(5, minmax(0, 1fr)) 1fr`, `white-space: nowrap`) và ẩn nút phụ `#btn-restart` trên màn hình điện thoại (vì đã có nút `Mở đầu` ngay trong dải giai đoạn và `Về mở đầu` ở Finale), đưa HUD mobile về lại **đúng 2 hàng cân đối**.
2. **Tiêu đề thẻ 2045 trên 1366px bị ngắt 3 dòng:** Trong `@media (max-width: 1440px) and (min-width: 1025px)`, cho phép `.policy-subcard-head` xuống dòng gọn với cỡ chữ `10px` để hai khối `MỤC TIÊU ĐẾN NĂM 2030` và `TẦM NHÌN ĐẾN NĂM 2045` cân bằng chiều cao.

Sau khi chỉnh sửa, đã build lại (`282ms`), chạy lại toàn bộ `4/4` test Playwright và kiểm tra lại trực quan `landing_390x844.png`, `scene_03_390x844.png`, `scene_03_1366x768.png` đạt **PASS**.

---

## 4. Độ sạch sản phẩm (`Production Purity`)

- **`0` phần tử debug / telemetry:** `[id*="vfx"], [id*="showcase"], [id*="debug"], [class*="debug"]` = `0`.
- **`0` thẻ `<audio>`** và **`0` yêu cầu CDN ngoài** (font `Be Vietnam Pro` WOFF/WOFF2 đóng gói cục bộ 100%).
- **`0` lỗi console, `0` pageerror, `0` requestfailed, `0` HTTP >= 400.**
- **`0` chuỗi lạc đề `20/11`:** Không tồn tại `Nét vẽ tri ân`, `Nhà giáo`, `Cô Liệu`, `Cô Ngọc`, `Sinh viên 5 tốt`, `20/11` trên toàn bộ DOM và HTML.
