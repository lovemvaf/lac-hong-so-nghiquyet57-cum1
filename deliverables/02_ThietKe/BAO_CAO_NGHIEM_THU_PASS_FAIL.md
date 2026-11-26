# BÁO CÁO NGHIỆM THU PASS/FAIL V2 — LẠC HỒNG SỐ (NGHỊ QUYẾT 57-NQ/TW · CỤM 1)

- **Dự án:** `lac-hong-so-nghiquyet57-cum1` — *LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1*
- **Cuộc thi:** Trại Thanh niên số thành phố Đồng Nai năm 2026 — Vòng thực chiến (**Chủ đề 1 – Nghị quyết đến gần thanh niên**, trọng tâm **Mục 2 – Thiết kế** & **Website trình chiếu bổ trợ**)
- **Trạng thái hồ sơ:** **`DRAFT_PENDING_TEAM_DETAILS`** (`CHO_NHOM_DUYET` — Cụm 1 đã xác nhận; `doiSo`, `diaBanCuThe`, `doiTruong`, Logo Hội Sinh viên giữ `null` / `false`)
- **Thông báo mốc thời gian trung thực (Section 01):** Hạn nộp toàn đội theo Đề thi là **`21:00 ngày 26/11/2026`** (trình bày sáng `27/11/2026`). Gói nâng cấp V2 (khóa nguồn SSOT, xuất lại 5 ấn phẩm `1080×1350`, website V2, video walkthrough & kiểm định QA) hoàn tất **sau `21:00 ngày 26/11/2026`** (rạng sáng `27/11/2026`) ở trạng thái gói biên tập/lưu trữ phục vụ thuyết trình; mốc V1 trước đó được giữ nguyên tại tag `v1-pre-sync`.
- **Kho mã nguồn & Trang Live V2:**
  - Repo: `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1` (commit ứng dụng `7da63da534c2c939bdde53a00f6ace6d4608afc1`, Actions run `#45875942597` `completed / success`)
  - Website V2: `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` (**HTTP 200 — PASS**)
  - Website gốc bảo toàn (V10 20/11): `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` (**HTTP 200 — PASS**, repo cha `f0138b6`)

---

## 1. Bảng Kiểm Định Section 12 — Quality Gates A–F (PASS / FAIL)

| Gate | Phạm vi & Yêu cầu kiểm định | Trạng thái | Bằng chứng xác thực đo trực tiếp |
|---|---|---|---|
| **Gate A — Content Lock, Fact-Check & Source Separation** | Khóa Single Source of Truth `campaign-content.json`, đồng bộ Excel (`SCRIPT`, `STUDY`, `THUYẾT TRÌNH`) với toàn văn NQ `57-NQ/TW`, tách biệt `03/NQ-CP` & `71/NQ-CP`, gắn `claimType` + `conceptNotice`, `0` claim sai/bịa. | **PASS** | `campaign-content.json` SHA-256 `66f6d1d5de5cbb30341209df1aef915b73d07650221990a9ab0dc35594a3a6b2` (trùng byte `src/content/campaign-content.json`). `CLAIMS_SOURCE_REGISTER.csv`: **42/42** mục đã phân loại (**0 `UNVERIFIED`**). 4 URL Chính phủ (`xaydungchinhsach.chinhphu.vn`, `mst.gov.vn`, `03/NQ-CP`, `71/NQ-CP`) kiểm tra trực tiếp HTTP `200`. |
| **Gate B — 05 Ấn phẩm V2 (`1080×1350`), SVG, Nhận diện & QR** | Đủ 05 PNG `1080×1350` RGB + 05 SVG lớp chỉnh sửa được, khớp 100% ở `deliverables/02_ThietKe/`, `LacHongSo_Cum1_NQ57_2026/design/`, `public/assets/posters/`; giữ nguyên Huy hiệu Đoàn; `jsQR` giải mã ra URL Chính phủ; có Contact Sheet & dải 25%. | **PASS** | `npm run qa:posters`: **`198 passed, 0 failed`**. 5 file `01_dat_cau_hoi_1080x1350.png`..`05_lan_toa_1080x1350.png` đều `1080×1350` RGB (`768 KB`–`1.48 MB`). `jsQR` giải mã trực tiếp pixel Poster `05` khớp byte URL `xaydungchinhsach.chinhphu.vn`. Huy hiệu Đoàn `huy-hieu-doan-clean.png` (`941×1042`, `interior_max_rgb_diff = 0`) cố định tại `(64, 56) 84×93 px`; `hoiSinhVienLogoAvailable = false`. `CONTACT_SHEET_v2.png` (`1920×1080`) & `MOBILE_READABILITY_25PCT.png` (`1520×500`) đã kiểm tra bằng mắt qua `read_file`. |
| **Gate C — Website V2 & Responsive Visual QA** | Website 7 giai đoạn đồng bộ JSON V2, Stage 3 hiện sẵn bảng `2030 → 2045` + nhãn cảnh báo không cần bấm thêm, nút `Tải PNG`, Modal `I` (7NV/4 trụ + 5 Q&A + nguồn), QR Finale `chinhphu.vn` + `mst.gov.vn`, responsive `1920×1080`, `1366×768`, `390×844`, `prefers-reduced-motion`, `0` debug/audio/20-11. | **PASS** | `pnpm test` (`tests/lac_hong_so.spec.js`): **`4 passed, 0 failed, 0 skipped`**. Đã mở xem trực tiếp toàn bộ 15 ảnh chụp trong `LacHongSo_Cum1_NQ57_2026/qa/screenshots/` (`landing`, `scene_01..05`, `scene_03_zoom`, `sources_modal`, `finale` ở `1920×1080`; `landing`, `scene_03`, `finale` ở `1366×768`; `landing`, `scene_03`, `scene_05` ở `390×844`) và đã tinh chỉnh xong lỗi rớt dòng HUD mobile về 2 hàng gọn. |
| **Gate D — Performance, Lifecycle & Video Walkthrough** | Build Vite sạch, đo FPS thực tế (Thường vs. Lite Mode & Reduced Motion) bằng `requestAnimationFrame` delta 2s + `PerformanceNavigationTiming`, ghi video walkthrough WebM `1280×720` (`> 50 KB`). | **PASS** | `pnpm run build`: `50 modules`, **`282 ms`**, `./dist` gồm `47` tệp (`8,020,846 B`). `vite preview`: `domInteractive 13.4 ms`, `loadEventEnd 1520.2 ms`; Normal Stage 0 `36.20 FPS`, Stage 4 `45.13 FPS` (`872 ms` transition); Lite Mode (`KeyL`) & `prefers-reduced-motion` đạt **`60.00 FPS`** (`72 ms` cut, `rafId` dừng hoàn toàn). Video `lac_hong_so_walkthrough.webm` đạt **`6,968,621 B` (`~6.65 MiB`)**. |
| **Gate E — Git Isolation, Pages Deploy & Dual Live Verification** | Repo cũ `net-ve-tri-an-dntu-2026` không bị chạm (`f0138b6`), đẩy repo mới `main` sạch lên GitHub, workflow `.github/workflows/deploy.yml` `completed / success`, kiểm chứng cả 2 site live HTTP `200`. | **PASS** | Repo cha giữ nguyên `f0138b6` (`git status` sạch). Actions run `#45875942597` (commit `7da63da5`) đạt `completed / success`. `node scripts/verify_live_both.mjs` xác nhận cả `lac-hong-so-nghiquyet57-cum1/` (V2) và `net-ve-tri-an-dntu-2026/` (V10 20/11) đều HTTP `200`, zero errors, zero overwrite. |
| **Gate F — Honest Timing, Missing Fields & Cross-Team Handoff** | Nêu rõ tình trạng sau `21:00 ngày 26/11/2026`, giữ `null`/`CHƯA XÁC NHẬN` cho thông tin đội chưa có, tách bạch ranh giới Mục 1/3/4 của các thành viên khác, có `README_SUBMISSION.md`. | **PASS** | Đã công bố minh bạch tại [README_SUBMISSION.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/README_SUBMISSION.md), [TEAM_REVIEW_REQUIRED.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/TEAM_REVIEW_REQUIRED.md) và Mục 3 bên dưới. |

---

## 2. Tự đối chiếu Thang Điểm Chấm Thi 100 Điểm (Theo Đề Thi Vòng Thực Chiến)

> Lưu ý trung thực: Kho này chỉ phụ trách **Mục 2 – Thiết kế** và **Website trình chiếu bổ trợ**. Tổng điểm chung cuộc `100 điểm` của toàn đội phụ thuộc thêm vào **Mục 1 (Video 9:16)**, **Mục 3 (Bài đăng Word)**, **Mục 4 (Thuyết minh 3 trang)** và **phần thi trực tiếp sáng 27/11/2026** của cả đội.

| Tiêu chí theo Đề thi | Điểm tối đa | Đánh giá sẵn sàng của gói Mục 2 + Web V2 | Phần còn phụ thuộc toàn đội (chưa hoàn tất thay nhóm khác) |
|---|---:|---|---|
| **1. Bám sát đề bài, giải quyết vấn đề thực tiễn** | **25** | Đạt chuẩn cốt lõi ở Mục 2 & nội dung nguồn: đúng Chủ đề 1 (`57-NQ/TW`), 42/42 mục đã kiểm chứng nguồn HTTP 200, tách biệt rõ mục tiêu 2030–2045 và phần việc đề xuất Cụm 1. | Cần đội điền **`doiSo`**, **`diaBanCuThe`** (xã/phường trong Cụm 1), **`doiTruong`** và ghép đủ 04 sản phẩm vào thư mục `Doi[số đội]_ChuDe1`. |
| **2. Tính sáng tạo, ứng dụng công nghệ số** | **25** | Mạnh ở Mục 2 & Web bổ trợ: phong cách Lạc Hồng Số + Trống đồng Đông Sơn, QR thật giải mã được trên ảnh & web, minh bạch AI, mã nguồn mở cục bộ (`Be Vietnam Pro`), chế độ hỗ trợ `L` / `I` / `Z` / `Tải PNG`. | Cần đồng bộ video tự quay/dựng Mục 1 (60–120s, 9:16, nhạc bản quyền) theo gợi ý chỉnh sửa `SCRIPT!C3` & `B6` tại `CROSS_TEAM_SYNC_MATRIX.md`. |
| **3. Chất lượng sản phẩm, khả năng triển khai tại cơ sở** | **25** | Mục 2 đạt **198/198** kiểm định `qa:posters`, 5 PNG `1080×1350` + 5 SVG vector chỉnh sửa được, đọc rõ ở tỷ lệ di động 25%, web chạy ổn định trên máy chiếu & điện thoại (`4/4` E2E PASS). | Cần hoàn thiện kênh/giờ đăng Fanpage cụ thể trong Bài đăng Word (Mục 3) và kế hoạch đo lường triển khai cơ sở trong Thuyết minh (Mục 4). |
| **4. Thuyết trình, phối hợp nhóm** | **25** | Đã cung cấp sẵn kịch bản phân vai 6 phút (`SPEAKER_NOTES_05_POSTERS.md`), 8 câu trả lời phản biện (`TEAM_REVIEW_REQUIRED.md`), phím tắt trình chiếu (`N`, `Z`, `I`, `L`, `F`) và video walkthrough mẫu. | Phụ thuộc trực tiếp phần trình bày 06 phút + trả lời phản biện 04 phút của các thành viên sáng `27/11/2026` và trạng thái hoàn thành hồ sơ đội sau mốc `21:00 ngày 26/11/2026`. |
| **Tổng cộng thang điểm BTC** | **100** | **Mục 2 & Website V2: Sẵn sàng hoàn chỉnh (`PASS` Gate A–F)** | **Hồ sơ thi 4 sản phẩm: Chờ nhóm duyệt & bổ sung (`DRAFT_PENDING_TEAM_DETAILS`)** |

---

## 3. Thông tin đội còn thiếu (`CHƯA XÁC NHẬN`) & Ranh giới nộp bài

1. **Các trường giữ nguyên `null` / `CHƯA XÁC NHẬN` (do không có trong đề thi hay Excel):**
   - `doiSo` (`null`): Số hiệu đội thi của Cụm 1.
   - `diaBanCuThe` (`null`): Tên xã/phường/đơn vị cụ thể thuộc Cụm 1.
   - `doiTruong` (`null`): Họ tên & SĐT Đội trưởng ký Phiếu đăng ký.
   - **Logo Hội Sinh viên Việt Nam** (`hoiSinhVienLogoAvailable = false`): không có file gốc trong tài liệu cung cấp, giữ nguyên chỉ dùng Huy hiệu Đoàn TNCS Hồ Chí Minh (`huy-hieu-doan-clean.png`).
2. **Mục sản phẩm của các thành viên khác (tuyệt đối không thay thế hay đánh dấu hoàn tất hộ):**
   - **Mục 1:** Video ngắn `MP4 9:16` (`60–120s`).
   - **Mục 3:** Bài đăng mạng xã hội (`01` tệp Word) kèm kênh & giờ đăng cụ thể.
   - **Mục 4:** Thuyết minh chính thức (`Word` hoặc `PDF`, tối đa `03` trang).
3. **Danh mục báo cáo QA V2 đầy đủ trong `LacHongSo_Cum1_NQ57_2026/`:**
   - [README_SUBMISSION.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/README_SUBMISSION.md)
   - [qa/POLICY_FACT_CHECK.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/POLICY_FACT_CHECK.md)
   - [qa/IMAGE_QUALITY_CHECK.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/IMAGE_QUALITY_CHECK.md)
   - [qa/WEB_VISUAL_QA.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/WEB_VISUAL_QA.md)
   - [qa/PERFORMANCE_QA.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/PERFORMANCE_QA.md)
   - [qa/DEPLOYMENT_VERIFICATION.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/qa/DEPLOYMENT_VERIFICATION.md)
