# XÁC MINH TRIỂN KHAI & KIỂM CHỨNG SONG SONG HAI TRANG LIVE (`DEPLOYMENT_VERIFICATION.md`)

- **Dự án V2:** `LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1` (`lac-hong-so-nghiquyet57-cum1`)
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` *(Cụm 1 đã xác nhận; `doiSo`, `diaBanCuThe`, `doiTruong` giữ `null`; thực hiện hoàn thiện/kiểm định V2 sau mốc `21:00 ngày 26/11/2026` phục vụ trình bày sáng `27/11/2026`)*
- **Công cụ kiểm chứng song song:** [scripts/verify_live_both.mjs](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/scripts/verify_live_both.mjs)

---

## 1. Thông tin Kho Git & GitHub Actions Deployment

- **Kho nguồn độc lập:** `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1` (nhánh `main`, công khai)
- **Mốc sao lưu V1 trước nâng cấp:** tag `v1-pre-sync` + ảnh lưu trữ tại `LacHongSo_Cum1_NQ57_2026/qa/before_v1/`
- **Commit bản dựng ứng dụng & tài sản V2 đã triển khai live:** `7da63da534c2c939bdde53a00f6ace6d4608afc1`
- **GitHub Actions Workflow (`.github/workflows/deploy.yml`):**
  - **Run ID:** `45875942597` (`run_number: 3`)
  - **URL:** `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1/actions/runs/45875942597`
  - **Trạng thái:** **`completed / success`** (`2026-11-26T18:26:31Z` → `18:27:03Z` UTC, tức `01:26:31`–`01:27:03` ICT ngày `27/11/2026`)
- **Kho lưu trữ gốc (Parent Repo `net-ve-tri-an-dntu-2026`):**
  - Nhánh `main` giữ nguyên không chỉnh sửa tại commit **`f0138b6`** (`chore: restore Net ve tri an V10 on main and ignore standalone lac-hong-so project`), `git status` sạch.

---

## 2. Kết quả kiểm chứng đồng thời 2 URL Live (`node scripts/verify_live_both.mjs`)

| Tiêu chí kiểm tra trực tiếp trên bản Live | URL Mới — **LẠC HỒNG SỐ V2**<br>`https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/` | URL Cũ — **Nét vẽ tri ân V10**<br>`https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/` |
|---|---|---|
| **Trạng thái HTTP** | **HTTP `200`** (**PASS**) | **HTTP `200`** (**PASS**) |
| **Nội dung hiển thị đúng dự án** | Landing **LẠC HỒNG SỐ**, Trống đồng Đông Sơn SVG (`>= 10` vòng), `#lac-hong-canvas`, Huy hiệu Đoàn nguyên bản, đủ 5 thẻ xem trước `01_dat_cau_hoi`..`05_lan_toa` (**PASS**) | `#landing-page` hiển thị **`Nét Vẽ Tri Ân — Một Dòng Code, Vạn Chân Trời \| Khoa CNTT – DNTU 20/11`**, poster `1500 × 2667 px` (**PASS**) |
| **05 Ấn phẩm V2 & Tỷ lệ `contain`** | `01_dat_cau_hoi_1080x1350.png` .. `05_lan_toa_1080x1350.png` đều `1080 × 1350 px`, `objectFit = contain`, không cắt xén, link `Tải PNG` đúng tên tệp (**PASS**) | Giữ nguyên bản V10 ngày `20/11`, `0` chuỗi `LẠC HỒNG SỐ` hay `Nghị quyết 57` (**PASS — Zero Overwrite**) |
| **Stage 3 (`2030 → 2045`) tự động hiển thị** | `#panel-policy-highlights` hiển thị ngay không cần bấm thêm; đủ `2030`, `2045`, `30%`, `80%`, `50%`, `TOP 30`, `MỤC TIÊU`, `TẦM NHÌN`, `KHÔNG PHẢI KẾT QUẢ HIỆN TẠI` (**PASS**) | Không bị ghi đè |
| **Modal `I` (`#sources-modal`)** | Bấm `KeyI` mở đủ `4` trụ (`7` nhiệm vụ), `5` câu hỏi đánh giá, link `chinhphu.vn` & `mst.gov.vn`, `03/NQ-CP`, `71/NQ-CP`; `Escape` đóng sạch (**PASS**) | — |
| **Stage 6 Finale QR & Links** | `#finale-qr-box svg` sắc nét, nút chính `xaydungchinhsach.chinhphu.vn`, link phụ `mst.gov.vn`, đủ 5 thumbnail `1080 × 1350 px` (**PASS**) | — |
| **Độ sạch & Lỗi mạng** | `0` `console.error`, `0` `pageerror`, `0` `requestfailed`, `0` HTTP `>= 400`, `0` debug/vfx/showcase, `0` `<audio>`, `0` chuỗi `20/11` (**PASS**) | Sẵn sàng hoạt động bình thường (**PASS**) |
| **Ảnh chụp live đã kiểm tra via `read_file`** | `live_lhs_landing.png`, `live_lhs_scene_03.png`, `live_lhs_scene_05.png`, `live_lhs_finale.png` | `live_old_net_ve_tri_an.png` |
