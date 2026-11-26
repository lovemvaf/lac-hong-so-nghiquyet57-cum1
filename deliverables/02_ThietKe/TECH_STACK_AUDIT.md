# TECH STACK & REPOSITORY AUDIT — LẠC HỒNG SỐ (CỤM 1)

**Dự án:** `lac-hong-so-nghiquyet57-cum1` (`LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1`)  
**Tài liệu đối chiếu:** `c:\Users\asus\Downloads\danh_sach_repo_tong_hop_moi_nhat.md` (rá soát 25/11/2026), `c:\Users\asus\Downloads\DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx`  
**Ngày kiểm tra trực tiếp trên đĩa & `node_modules`:** 26/11/2026  
**Nguyên tắc lựa chọn:** Chỉ cài đặt và sử dụng tập thư viện tối giản, có giấy phép mở tương thích đã xác minh trực tiếp trong `package.json` / `LICENSE`; **không** cài thừa các thư viện 3D/VFX nặng hoặc có giấy phép copyleft/hạn chế thương mại.

---

## 1. Kiểm tra đường dẫn thực tế trên đĩa theo 6 nhóm Manifest

> Ghi chú phương pháp: Tài liệu tổng hợp `danh_sach_repo_tong_hop_moi_nhat.md` ghi tiêu đề tổng *“213 repos (C:, E:, G:)”* với 6 nhóm tiêu biểu có tổng nhãn là `44 + 32 + 33 + 25 + 19 + 28 = 181`. Bảng dưới đây ghi nhận **số thư mục / `.git` repo kiểm chứng thực tế trên đĩa ngày 26/11/2026** bằng script Python duyệt cây thư mục (bỏ qua `node_modules`, `dist`, `build`):

| Nhóm trong Manifest | Đường dẫn gốc trên máy | Nhãn trong Manifest | Số lượng quan sát trực tiếp | Ghi chú kiểm chứng |
|---|---|---:|---:|---|
| **1. Dự án Netvetrian** (Web, Animation, Trình chiếu) | `C:\Users\asus\Desktop\Netvetrian_QKD_KhoaCNTT-DNTU\.research\repos` | 44 | **43 thư mục / 43 `.git` repos** | Toàn bộ repo cốt lõi có mặt đầy đủ trên đĩa (`GSAP`, `reveal.js`, `vite`, `playwright`, `three.js`, `canvas-confetti`, `fullPage.js`, `react-bits`, v.v.). |
| **2. Antigravity Agent Skills & Frameworks** | `C:\Users\asus\.gemini\config\skills\_repos` | 32 | **32 thư mục trực tiếp / 32 `.git` repos** (chưa tính `_writing_repos`) | Có đầy đủ bộ skill UI/UX, design system, agent workflow và thư mục lồng `_writing_repos`. |
| **3. Antigravity Writing & Humanizer** | `C:\Users\asus\.gemini\config\skills\_repos\_writing_repos` | 33 | **33 thư mục / 33 `.git` repos** | Khớp 100% danh sách 33 repo biên tập tiếng Việt & tiếng Anh (`01_blader_humanizer` … `33_syntaf_vale_llm_slop`). |
| **4. Video Production Toolkit** | `C:\Users\asus\.gemini\antigravity\scratch\video-production-toolkit` | 25 | **25 `.git` repos** | Khớp 100% ở các thư mục con `01`–`07` (dành cho sản xuất video Mục 1 của đội, tách biệt với thiết kế Mục 2). |
| **5. Hackathon & Toolbox (Ổ E:)** | `E:\04_Projects\Group 8 - Hackathon Dong Nai`, `Dong Nai Memory`, `IoT Learning Workspace` | 19 | **19 `.git` repos** (`8 + 2 + 9`) | `Group 8`: `8` repo; `Dong Nai Memory`: `2` repo; `IoT Learning Workspace`: `9` repo (nằm trong cấu trúc thư mục con). |
| **6. Dự án cá nhân** (`Documents`, `source\repos`, `Downloads`, `Desktop`) | Các thư mục người dùng trên ổ `C:` | 28 | **31 `.git` repos** (`12 Documents + 3 source\repos + 13 Downloads + 3 Desktop`, đã gồm repo mới `lac-hong-so-nghiquyet57-cum1` và repo cha) | Mọi thư mục gốc đều tồn tại thật trên ổ đĩa. |

---

## 2. Tech Stack được chọn cho `lac-hong-so-nghiquyet57-cum1` (Đã xác minh giấy phép)

Dự án mới khởi tạo độc lập với tối thiểu thư viện cần thiết cho **xuất 05 ấn phẩm `1080 × 1350 px`**, **kiểm định QR/ảnh tự động**, và **website trình chiếu/triển lãm Lạc Hồng Số**:

| Gói / Công cụ | Phiên bản thực tế | Giấy phép xác minh trực tiếp | Tệp nguồn xác minh | Vai trò trong dự án mới |
|---|---|---|---|---|
| **GSAP** (`gsap`) | `3.15.1` | **Standard "No Charge" GreenSock License** (`https://gsap.com/standard-license`) | `node_modules/gsap/package.json` | Điều phối chuyển cảnh mượt (0.5–0.9s) trên website trình chiếu |
| **reveal.js** | `6.0.2` | **MIT** | `node_modules/reveal.js/package.json`, `LICENSE` | Khung trình chiếu mạch truyện `Landing → 01/05..05/05 → Finale` |
| **Vite** (`vite`) | `8.3.8` | **MIT** | `node_modules/vite/package.json`, `LICENSE.md` | Dev server (cổng `5174`, base `/lac-hong-so-nghiquyet57-cum1/`) và build tĩnh `./dist` cho GitHub Pages |
| **Playwright** (`@playwright/test`) | `1.65.1` | **Apache-2.0** | `node_modules/@playwright/test/package.json`, `LICENSE` | Render SVG/HTML → PNG `1080 × 1350` sắc nét và kiểm thử E2E website (`tests/`) |
| **@fontsource/be-vietnam-pro** | `5.3.0` | **SIL Open Font License 1.1 (`OFL-1.1`)** | `node_modules/@fontsource/be-vietnam-pro/package.json`, `LICENSE` | Nhúng offline font **Be Vietnam Pro** hỗ trợ đầy đủ dấu tiếng Việt cho cả ấn phẩm và web |
| **qrcode** | `1.5.4` | **MIT** | `node_modules/qrcode/package.json`, `license` | Sinh mã QR thật (ECC High, quiet zone rõ) trỏ tới toàn văn trên `mst.gov.vn` |
| **jsqr** | `1.4.0` | **Apache-2.0** | `node_modules/jsqr/package.json`, `LICENSE` | Giải mã kiểm chứng trực tiếp từng pixel QR trên PNG xuất cuối trong `qa:posters` |
| **Python Pillow & NumPy** | `Pillow 12.2.0` / `NumPy 2.4.6` | **MIT-CMU** (Pillow) / **BSD-3-Clause** (NumPy) | `importlib.metadata` trong môi trường Python cục bộ | Tách nền sạch Huy hiệu Đoàn (`scripts/prepare_doan_emblem.py`, `0` sai lệch pixel nội dung) & kiểm tra kích thước ảnh |

---

## 3. Các gói & thư viện BỊ LOẠI TRỪ rõ ràng

| Thư viện | Giấy phép / Hiện trạng xác minh | Quyết định & Lý do loại trừ |
|---|---|---|
| **`fullPage.js`** (`4.0.41` trong `.research/repos`) | **GNU GPL-3.0** (xác minh tại `.research/repos/fullPage.js/LICENSE`) | **LOẠI TRỪ.** Copyleft mạnh, xung đột với cấu trúc mã nguồn mở nhẹ dựa trên `reveal.js` (MIT). |
| **`react-bits`** (trong `.research/repos`) | **MIT + Commons Clause License Condition v1.0** (xác minh tại `.research/repos/react-bits/LICENSE.md`) | **LOẠI TRỪ.** Bị hạn chế bởi điều khoản Commons Clause và không cần React cho triển lãm tĩnh. |
| **`three`** (`0.187.0`) & **`canvas-confetti`** (`1.9.4`) | Thuộc dự án cũ *"Nét vẽ tri ân"* V10 (MIT / ISC) | **LOẠI BỎ KHỎI DỰ ÁN MỚI.** Chủ đề **LẠC HỒNG SỐ** dùng canvas 2D tiết chế (họa tiết trống đồng & Chim Lạc thanh nhã) thay cho pháo hoa/3D nặng, giúp giảm dung lượng bundle và tránh lạc đề thi Nghị quyết 57-NQ/TW. |
| **`remotion`, `murmurations`, `LiquidDistortion`** | Yêu cầu giấy phép riêng hoặc vượt phạm vi Mục 2 | **KHÔNG SỬ DỤNG.** Dư thừa so với thiết kế 05 poster `1080 × 1350` và website trình chiếu bổ trợ. |
