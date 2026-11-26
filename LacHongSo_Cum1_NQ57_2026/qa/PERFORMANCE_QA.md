# KIỂM ĐỊNH HIỆU NĂNG & TÀI NGUYÊN (`PERFORMANCE_QA.md`)

- **Môi trường đo thực tế:** `vite preview` phục vụ bản build tĩnh `./dist` tại `http://127.0.0.1:4174/lac-hong-so-nghiquyet57-cum1/` trong Playwright Chromium (`headless`, `1920 × 1080`)
- **Video minh họa chuyển động thực tế (`1280 × 720` WebM):** [lac_hong_so_walkthrough.webm](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/VIDEO_SCREEN_RECORDINGS/lac_hong_so_walkthrough.webm) (`6,968,621 B` ≈ `6.65 MiB`, ghi xuyên suốt `Stage 0 → 1 → 2 → 3 → 4 → 5 → Zoom (Z) → Finale`)

---

## 1. Kích thước gói build Vite Production (`pnpm run build`)

- **Thời gian build:** `282 ms` (`vite@8.3.8`, `50 modules transformed`, `0` cảnh báo vượt ngưỡng `900 kB`).
- **Tổng số tệp xuất trong `./dist`:** `47` tệp — **`8,020,846 B`** (`~7.65 MiB`), gồm:

| Nhóm tài nguyên trong `./dist` | Số tệp | Dung lượng gốc | Ghi chú gzip / tối ưu |
|---|---:|---:|---|
| `index.html` | 1 | `24,815 B` (`24.81 kB`) | `5.53 kB` gzip |
| CSS bundle (`assets/index-*.css`) | 1 | `93,198 B` (`93.19 kB`) | `18.63 kB` gzip |
| JS bundle (`assets/index-*.js`: Reveal + GSAP + QRCode + SSOT JSON) | 1 | `309,862 B` (`309.86 kB`) | `94.03 kB` gzip |
| Font cục bộ `@fontsource/be-vietnam-pro` (`.woff2` + `.woff`) | 36 | `481,500 B` | Gồm 18 `.woff2` (`284,524 B`) + 18 `.woff` (`196,976 B`), chạy offline 100% |
| Bộ 05 poster V2 (`assets/posters/*.png`, `1080×1350`) | 5 | `6,174,559 B` | Tiền tải (preload) ngay khi mở web để chuyển cảnh không nháy |
| Bộ tài sản Huy hiệu Đoàn (`assets/identity/`) | 3 | `936,912 B` | Gồm `clean.png` (`598,535 B`), `user-png.png` (`71,672 B`), `original.jpg` (`266,705 B`) |

---

## 2. Thời gian tải & chỉ số đo thực tế (`PerformanceNavigationTiming`)

Đo trực tiếp khi mở `http://127.0.0.1:4174/lac-hong-so-nghiquyet57-cum1/` trên Chromium `1920 × 1080`:

| Chỉ số đo | Giá trị đo thực tế | Ý nghĩa vận hành |
|---|---:|---|
| `domInteractive` | **`13.4 ms`** | DOM chính tương tác được gần như tức thì |
| `domContentLoadedEventEnd` | **`1,438.7 ms`** | Hoàn tất parse DOM & thực thi module JS khởi tạo (gồm SVG Trống đồng & QR) |
| `loadEventEnd` (`PerformanceNavigationTiming` & `performance.timing`) | **`1,520.2 ms`** (`1,520 ms`) | Hoàn tất tải toàn bộ tài sản lần đầu |
| `networkidle` + `document.fonts.ready` | **`1,561 ms`** | Sẵn sàng trình chiếu toàn diện (đã tải đủ font tiếng Việt & 5 poster preload) |
| Tổng tài nguyên nạp lúc mở trang | **`21` requests · `7,103,477 B`** | Không gọi bất kỳ CDN bên ngoài nào (`0` external requests) |

---

## 3. Đo tốc độ khung hình (`requestAnimationFrame` delta trong 2 giây) — Thường vs. Chế độ nhẹ (`L`)

Đo trực tiếp chu kỳ `requestAnimationFrame` liên tục trong `2,000 ms` tại `1920 × 1080` trên Chromium headless (lưu ý: môi trường headless dùng rasterizer phần mềm khi vẽ `backdrop-filter: blur(14px)` + canvas `1920×1080`):

| Chế độ & Bối cảnh đo | Số khung hình / Thời gian | FPS trung bình | Delta TB | Delta P95 | Delta Max | Thời gian chuyển cảnh |
|---|---:|---:|---:|---:|---:|---:|
| **Chế độ thường — Stage 0 Landing** *(SVG Trống đồng quay + `backdrop-filter` + Canvas 2D)* | `73 frames / 2,016.5 ms` | **`36.20 FPS`** | `27.62 ms` | `33.4 ms` | `50.0 ms` | — |
| **Chế độ thường — Stage 4** *(Canvas 2D + đàn chim Lạc theo nhịp `4.4–6.4s`)* | `91 frames / 2,016.6 ms` | **`45.13 FPS`** | `22.16 ms` | `33.4 ms` | `33.4 ms` | **`872 ms`** (`0 → 1`) |
| **Chế độ nhẹ (`KeyL`) — Stage 4** *(Dừng vòng `rafId` Canvas, xóa đàn chim, tắt spin Trống đồng)* | `120 frames / 1,999.9 ms` | **`60.00 FPS`** | `16.67 ms` | `16.7 ms` | `16.8 ms` | **`72 ms`** (`4 → 5`, cắt cảnh tức thì) |
| **`prefers-reduced-motion: reduce`** *(Tự động bật Lite Mode ngay lúc tải trang)* | `121 frames / 2,016.6 ms` | **`60.00 FPS`** | `16.67 ms` | `16.7 ms` | `16.8 ms` | Khởi động tĩnh 100% |

---

## 4. Kiểm soát vòng đời `requestAnimationFrame` & GSAP (Lifecycle Hygiene)

- **Canvas 2D (`src/scripts/lac-hong-canvas.js`):**
  - Giới hạn `dpr = Math.min(window.devicePixelRatio || 1, 2)` để tránh phình bộ đệm trên màn hình HiDPI.
  - Khi bật **Chế độ nhẹ (`L`)** hoặc gặp `prefers-reduced-motion: reduce`, gọi ngay `stopLoop()` (`window.cancelAnimationFrame(rafId); rafId = null`), làm sạch mảng `flocks.length = 0`, vẽ đúng 1 khung tĩnh rồi dừng hẳn — không đốt CPU khi nghỉ.
  - Hàm `destroy()` hủy `rafId` và gỡ listener `resize`.
  - Đàn chim Lạc ở Stage 4 giới hạn tối đa `2` đàn cùng lúc trên hành lang trời cao (`4.8%..13%` chiều cao), còn Stage 3 giữ nền trang nghiêm tĩnh lặng không chồng nhiễu lên số liệu `2030 → 2045`.
- **GSAP Timeline (`src/scripts/motion-controller.js`):**
  - Mỗi lần chuyển giai đoạn có cơ chế ngắt an toàn (`transitionTimeline.kill()`, `stageTimeline.kill()`) kèm bộ đếm `activeTransitionSeq` chống xung đột khi bấm phím nhanh liên tiếp.
  - Khi bật **Chế độ nhẹ (`L`)**, timeline đang chạy được đưa về `.progress(1).kill()`, giải phóng transform và đưa mọi phần tử về trạng thái tĩnh ngay lập tức (`72 ms` tổng độ trễ UI so với `872 ms` khi có hiệu ứng).
  - Tuyệt đối không có hiệu ứng nhấp nháy/strobe và giữ mọi con số mục tiêu trên Stage 3 đứng yên hoàn toàn sau khi xuất hiện.
