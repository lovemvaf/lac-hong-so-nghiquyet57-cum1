# BÁO CÁO NGHIỆM THU PASS/FAIL — LẠC HỒNG SỐ (NGHỊ QUYẾT 57-NQ/TW · CỤM 1)

- **Dự án:** `lac-hong-so-nghiquyet57-cum1` — *LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1*
- **Cuộc thi:** Trại Thanh niên số thành phố Đồng Nai năm 2026 — Vòng thực chiến (Mục 2 – Thiết kế & Website trình chiếu bổ trợ)
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` *(Cụm 1 đã xác nhận; các trường đội thi chưa có trong đề và file Excel giữ `null`, không tự bịa)*
- **Ngày nghiệm thu:** 27/11/2026
- **Kho mã nguồn độc lập:** `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1` (nhánh `main`, commit triển khai ban đầu `0eee8e7cb99ee194dfdba4c7aa0cd5ff2e2ebbc6`)
- **Live URL mới (LẠC HỒNG SỐ):** `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` (**HTTP 200 — PASS**)
- **Live URL cũ (Nét vẽ tri ân V10 đã khôi phục):** `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` (**HTTP 200 — PASS, không bị ghi đè**)
- **Commit khôi phục repo cha (`net-ve-tri-an-dntu-2026`):** `f0138b6` (khôi phục từ `backup/net-ve-tri-an-20-11-v10`, bản nháp NQ57 cũ lưu tại `archive/nq57-draft-v1`)

---

## 1. Bảng Nghiệm Thu Section K (PASS / FAIL & Bằng Chứng Đo Thực Tế)

| Mã kiểm tra | Điều kiện nghiệm thu (Section K) | Kết quả | Bằng chứng & thông số đo thực tế |
|---|---|---|---|
| **K1** | **Tách dự án & bảo toàn repo cũ (`net-ve-tri-an-dntu-2026`)**: Dự án mới nằm trong kho Git độc lập `lac-hong-so-nghiquyet57-cum1/`; repo cũ `net-ve-tri-an-dntu-2026` khôi phục nguyên trạng V10 và không bị ghi đè trên live Pages. | **PASS** | Repo cha `main` ở commit `f0138b6` (`git diff backup/net-ve-tri-an-20-11-v10 main` chỉ thêm `lac-hong-so-nghiquyet57-cum1/` vào `.gitignore`). `scripts/verify_live_both.mjs` mở `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` trả HTTP `200`, hiển thị `Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời \| Khoa CNTT – DNTU 20/11`, poster `1500×2667 px`, `0` chuỗi NQ57. |
| **K2** | **05 ấn phẩm thật `1080 × 1350` sRGB PNG & đồng bộ `public/assets/posters/`**: Đủ 5 file PNG (`>100KB`, chế độ màu RGB), có 5 SVG nguồn chỉnh sửa được (`viewBox="0 0 1080 1350"`, đủ nhóm `<g>`), `CONTACT_SHEET.png`, không cắt đầu/chân/Chim Lạc. | **PASS** | `npm run qa:posters` đạt **`131 passed, 0 failed`**: `01_KhoiNguonNhanThuc.png` (`1,476,785 B`), `02_HieuDungNoiDung.png` (`993,123 B`), `03_HanhDongThietThuc.png` (`1,683,805 B`), `04_LanToaCongDong.png` (`1,738,847 B`), `05_KhatVongLacHongSo.png` (`1,375,405 B`) đều `1080×1350` PIL `RGB`, trùng byte 100% với `public/assets/posters/*`; `editable/01.svg..05.svg` đầy đủ layer + WOFF2 nhúng cục bộ; `CONTACT_SHEET.png` `1920×1080` (`940,969 B`). |
| **K3** | **Nhận diện Đoàn gốc & trung thực Logo Hội Sinh viên**: Dùng nguyên bản Huy hiệu Đoàn không biến dạng, không tự bịa Logo Hội Sinh viên khi thiếu file gốc. | **PASS** | `huy-hieu-doan-original.jpg` (`925×1024 px`, SHA-256 `b37deef...56571a`) → `huy-hieu-doan-clean.png` (`941×1042 px` RGBA, `interior_max_rgb_diff = 0`). Đặt cố định `(64, 56)` kích thước `84×93 px` trên cả 5 SVG/PNG và badge trên web. `hoiSinhVienLogoAvailable = false` được ghi nhận trung thực trong `campaign.config.json` và `SOURCES.md`. |
| **K4** | **QR thật trên Poster 05 & Finale + Fact-check `0` claim sai lệch**: Giải mã trực tiếp pixel PNG 05 bằng `jsQR` ra đúng URL toàn văn Nghị quyết `57-NQ/TW` trên `mst.gov.vn`; `0` số liệu/claim bịa đặt. | **PASS** | `jsQR` trong `qa:posters` giải mã pixel `05_KhatVongLacHongSo.png` khớp 100% từng ký tự URL `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm`. `FACT_CHECK_NQ57.md` xác nhận `0` claim `UNVERIFIED`. |
| **K5** | **Website 7 giai đoạn (`Landing → 01..05 → Finale`) & điều khiển đồng bộ**: Mở trực tiếp Stage 0 có Trống đồng Đông Sơn vector + Chim Lạc `#lac-hong-canvas` + Huy hiệu Đoàn + `#btn-start`; 6 lần bấm tiến (`#btn-start`/`#btn-next`) tới Finale, 6 lần `#btn-prev` về Landing; đủ phím tắt (`ArrowRight`, `ArrowLeft`, `Space`, `End`, `Home`, `N`, `L`, `Z`, `Escape`, `R`). | **PASS** | Xác minh tự động trong `tests/lac_hong_so.spec.js` (`3/3` test **PASS**, `0` failed, `0` skipped) qua Playwright Chromium. `STAGE 6` hiển thị đủ 5 ảnh thu nhỏ bấm mở Lightbox `Z`, QR SVG động (`qrcode.toString`), link `mst.gov.vn`, nút quay lại & công bố minh bạch AI. |
| **K6** | **Hiển thị trọn vẹn `object-fit: contain` không cắt xén & responsive**: Posters 01–05 hiển thị trọn vẹn trong viewport ở `1920×1080` và `1366×768`; giao diện `390×844` cuộn dọc mượt không tràn ngang. | **PASS** | Kiểm chứng trực tiếp bằng đo `getBoundingClientRect()` & `read_file` ảnh chụp ở `1920×1080`, `1366×768` và `390×844` (`scrollWidth <= 390`, `overflowY: auto`, HUD 2 hàng gọn gàng trên mobile, zero clipping trên tất cả 5 poster). |
| **K7** | **Độ sạch sản phẩm (`Production Purity`)**: Không bảng debug/telemetry (`[id*="vfx"]`, `[id*="showcase"]`, `[id*="debug"]` = 0), không `<audio>`, không lỗi console/page/404, không CDN ngoài, không rò chuỗi `20/11` cũ. | **PASS** | Kiểm tra trên bản `vite build` (`dist/` build `570ms`, exit `0`, `@fontsource/be-vietnam-pro` cục bộ), trên local `lac_hong_so.spec.js` và trên live GitHub Pages (`verify_live_both.mjs`): `0` phần tử debug, `0` `<audio>`, `0` lỗi console/page/404, `0` chuỗi `Nét vẽ tri ân`/`Nhà giáo`/`Cô Liệu`/`Cô Ngọc`/`Sinh viên 5 tốt`/`20/11`. |
| **K8** | **Triển khai GitHub Pages công khai & kiểm chứng bản live**: Repo `lovemvaf/lac-hong-so-nghiquyet57-cum1` công khai, workflow `.github/workflows/deploy.yml` chạy `success`, xác minh song song cả 2 live URLs bằng Playwright. | **PASS** | GitHub Actions run `#45866397438` (commit `0eee8e7`) đạt `completed / success`. `node scripts/verify_live_both.mjs` đạt **PASS** cho cả `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` và `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`, đã mở kiểm tra trực tiếp 4 ảnh live via `read_file`. |
| **K9** | **Bàn giao trung thực trạng thái dữ liệu còn thiếu & phạm vi đội thi**: Không tự bịa metadata thiếu, ghi rõ các mục thi khác của đội và hạn nộp. | **PASS** | `campaign.config.json` giữ `status: "DRAFT_PENDING_TEAM_DETAILS"` (`cumDonVi = "Cụm 1"`; `doiSo`, `diaBanCuThe`, `doiTruong` = `null`; `hoiSinhVienLogoAvailable = false`). Ghi nhận đầy đủ tại Mục 3 & Mục 4 bên dưới. |

---

## 2. Đối chiếu Quality Gates (Gate 0 – Gate 6 theo Quy chuẩn Cuộc thi)

| Gate | Nội dung kiểm tra | Trạng thái | Ghi chú thực tế |
|---|---|---|---|
| **Gate 0 — Source & Scope** | Đọc đề thi chính thức, giữ đúng Mục 2 – Chủ đề 1, dùng Huy hiệu Đoàn gốc, tách riêng 5 file, ghi trung thực các trường chưa có văn bản. | **PASS (với metadata chờ đội điền)** | `cumDonVi = "Cụm 1"` đã xác nhận; `doiSo`, `diaBanCuThe`, `doiTruong` để `null` (`DRAFT_PENDING_TEAM_DETAILS`). |
| **Gate 1 — Nội dung Nghị quyết** | Chính xác số hiệu `57-NQ/TW`, ngày `22/12/2024`, giữ đủ 4 trụ nội dung (KH, CN, ĐMST, CĐS), không bịa số liệu, có `FACT_CHECK_NQ57.md`. | **PASS** | Đối chiếu trực tiếp toàn văn từ `mst.gov.vn` (HTTP 200) và `chinhphu.vn` (HTTP 200 gzip); `0` claim `UNVERIFIED`. |
| **Gate 2 — 05 Tác phẩm thật** | Đủ 05 PNG `1080×1350`, 05 SVG chỉnh sửa được, tranh 2D gouache bán hiện thực nhất quán 4 nhân vật, kết truyện nhân rộng kỹ năng số. | **PASS** | Toàn bộ 6 tệp minh họa (`character-style-sheet-lhs.png` + `01..05_lhs_raw.png`) và 5 poster xuất cuối đạt chuẩn giải phẫu, mạch truyện và vùng an toàn `4:5`. |
| **Gate 3 — Nhận diện & Typography** | Huy hiệu Đoàn nguyên bản không méo/đổi màu, font Be Vietnam Pro nhúng cục bộ không lỗi dấu, không chữ/QR rác do AI vẽ. | **PASS** | Font WOFF2 nhúng trực tiếp trong SVG & Vite bundle; toàn bộ tranh thô 100% không chữ/QR giả. |
| **Gate 4 — Trình chiếu** | Giao diện 7 giai đoạn mượt, poster fit `contain` không crop ở `1920×1080` & `1366×768`, mobile cuộn sạch, có `Chế độ nhẹ (L)`, không rò 20/11, repo cũ được khôi phục. | **PASS** | Kiểm chứng cả local (`1920×1080`, `1366×768`, `390×844`) và live URL trên GitHub Pages. |
| **Gate 5 — Kiểm thử kỹ thuật** | `qa:posters`, `pnpm run build`, Playwright E2E, `jsQR` decode, live Pages deployment verification đều PASS. | **PASS** | `qa:posters`: `131/131` PASS; `pnpm run build`: exit `0`; `pnpm test`: `3/3` PASS; `verify_live_both.mjs`: PASS cả 2 URL. |
| **Gate 6 — Bàn giao trung thực** | Naming chuẩn trong `deliverables/02_ThietKe/`, tuyên bố minh bạch AI, tách bạch rõ phần việc của các thành viên khác và nhắc hạn nộp. | **PASS (chờ đội hoàn tất hồ sơ cuối)** | Xem chi tiết thông tin còn thiếu và đầu việc của các nhóm khác tại Mục 3 & Mục 4. |

---

## 3. Thông tin tùy chọn / Metadata còn thiếu (`DRAFT_PENDING_TEAM_DETAILS`)

Kiểm tra trực tiếp tài liệu gốc của BTC (`DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` và `TRẠI THANH NIÊN SỐ.xlsx`) xác nhận **chưa có** các trường sau trong hồ sơ hiện tại — dự án giữ nguyên trạng thái trung thực (`null` / `false`) và **tuyệt đối không tự bịa**:

1. **`doiSo`** (`null`): Số hiệu đội thi chính thức của Cụm 1 trên Phiếu đăng ký.
2. **`diaBanCuThe`** (`null`): Tên xã/phường/địa bàn cụ thể được phân công triển khai tại thành phố Đồng Nai (nếu BTC/đội yêu cầu ghi chi tiết hơn `Cụm 1`).
3. **`doiTruong`** (`null`): Họ tên Đội trưởng / đại diện ký nộp bài.
4. **Logo Hội Sinh viên Việt Nam** (`hoiSinhVienLogoAvailable: false`): Không có tệp gốc chính thức từ tài liệu đầu vào nên bộ ấn phẩm và website chỉ sử dụng **Huy hiệu Đoàn TNCS Hồ Chí Minh** nguyên bản đã xác minh; không dùng AI vẽ lại và không đặt khung giữ chỗ giả.

> Khi đội bổ sung chính thức các thông tin trên, chỉ cần cập nhật `deliverables/02_ThietKe/campaign.config.json` (và chạy lại `npm run export:posters && npm run qa:posters` nếu muốn bổ sung dòng định danh đội vào chân trang hoặc metadata).

---

## 4. Nhắc nhở mốc thời gian & Phần việc thuộc vai trò khác trong đội

- **Mốc hạn nộp bài thi theo Đề thi BTC:** **`21:00 ngày 26/11/2026`** *(thiết kế & web trình chiếu phục vụ bảo vệ sáng **27/11/2026** — tối đa 10 phút: 06 phút trình bày, 04 phút phản biện)*.
- **Phạm vi đã hoàn thành trong kho này:** Chuyên trách **Mục 2 – Thiết kế** (05 ấn phẩm `1080×1350`, 05 SVG chỉnh sửa được, contact sheet, đối chiếu nguồn & nghiệm thu) và **Website trình chiếu LẠC HỒNG SỐ** (`deliverables/Website_TrinhChieu/`).
- **Các sản phẩm khác của toàn đội (chưa thuộc phạm vi kho thiết kế này — tuyệt đối KHÔNG đánh dấu đã hoàn tất thay nhóm khác):**
  - **Mục 1 — Video ngắn** tuyên truyền chủ đề 1.
  - **Mục 3 — Bài đăng truyền thông (tệp Word)** kèm chú thích và thông điệp.
  - **Mục 4 — Bài thuyết minh / kịch bản trình bày chính thức** nộp cùng hồ sơ dự thi của đội trước khi tải lên biểu mẫu BTC.
