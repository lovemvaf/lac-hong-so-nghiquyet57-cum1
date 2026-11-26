# KIỂM ĐỊNH CHẤT LƯỢNG HÌNH ẢNH & ẤN PHẨM (`IMAGE_QUALITY_CHECK.md`)

- **Bộ sản phẩm kiểm định:** 05 ấn phẩm V2 `1080 × 1350 px` (`4:5` sRGB) + 05 tệp vector chỉnh sửa (`editable/01.svg`..`05.svg`) + `CONTACT_SHEET_v2.png` + `MOBILE_READABILITY_25PCT.png`
- **Công cụ kiểm định tự động:** `npm run qa:posters` ([scripts/qa-posters.mjs](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/scripts/qa-posters.mjs)) + Python Pillow + `jsQR` (`jsqr@1.4.0`) + kiểm tra trực quan qua ảnh xuất
- **Kết quả tổng hợp:** **`198 passed, 0 failed`** (`exit 0`)

---

## 1. Thông số kỹ thuật, đồng bộ byte-to-byte & mã băm SHA-256

Toàn bộ 05 PNG và 05 SVG trùng khớp từng byte giữa:
- `deliverables/02_ThietKe/`
- `LacHongSo_Cum1_NQ57_2026/design/` (kèm `editable/`)
- `public/assets/posters/` (đối với 05 PNG; các tệp V1 cũ `01_KhoiNguonNhanThuc.png`..`05_KhatVongLacHongSo.png` đã được dọn sạch).

| Ấn phẩm | Tệp PNG (`1080×1350`, `RGB`) | Dung lượng PNG | SHA-256 PNG | Tệp SVG (`viewBox 0 0 1080 1350`) | Dung lượng SVG | SHA-256 SVG |
|---|---|---:|---|---|---:|---|
| **01/05** | `01_dat_cau_hoi_1080x1350.png` | `1,476,053 B` | `6dbef7893e239b377c8184ed6cf4415b57ac8ffb2d8bf86426b89f1239e35da3` | `editable/01.svg` | `3,024,333 B` | `ba2c912afdf00e6421b8b8367a8d51dffaa8d62d07fc2d059f774de038f12ae1` |
| **02/05** | `02_quan_diem_cot_loi_1080x1350.png` | `768,628 B` | `d1240fd167504394498279e9d73748e6847172323774ee2748b7e614887eb997` | `editable/02.svg` | `2,459,318 B` | `6d888bf4c637f3ae4fd11fa4a2a8050d67bc27305d35067ff4f671c36f533602` |
| **03/05** | `03_muc_tieu_2030_tam_nhin_2045_1080x1350.png` | `1,147,569 B` | `a37508c94dbe4d4787fe543832f333bad90ae530fedec284944beee98d69b550` | `editable/03.svg` | `2,632,902 B` | `e133fac3ef07866f5de8e71f679ff9afc4129ba6d9cfe277097a8e3b60aa3f67` |
| **04/05** | `04_thanh_nien_cum1_hanh_dong_1080x1350.png` | `1,396,667 B` | `92e8e8c21b6acc20fdc2432c14c15d89e8e6de77e3bdcadb8ce9491b4f4bb153` | `editable/04.svg` | `3,089,264 B` | `90911c88e34a0b70dc496a4a156d6a5e99aab5211448f7006ceac48eb0893635` |
| **05/05** | `05_lan_toa_1080x1350.png` | `1,385,642 B` | `17ca798c9c9c62de555b87f451fd5603929083cd45f28d5959bc6ce40e19b65e` | `editable/05.svg` | `3,123,786 B` | `f776e2453b08d9d2e3a1636fc5fe8066f2341ca1b39e8d8852399a2a1327f881` |

- **Bảng tổng hợp & Bảng kiểm khả năng đọc di động:**
  - `CONTACT_SHEET_v2.png` (trùng byte `deliverables/02_ThietKe/CONTACT_SHEET.png`): `1920 × 1080 px` RGB, `841,738 B`, SHA-256 `b1b238a3dd16a3f499fcb2b922c1c53838c0fae44b5e0ad2b93ea8cd696be6ae`.
  - `MOBILE_READABILITY_25PCT.png`: `1520 × 500 px` RGB, `587,879 B`, SHA-256 `3355e9e9b0bfcd338664cc7106a804339baa2cead5255672c06b06f2eb75fb05`.

---

## 2. Kết quả kiểm tra 198 tiêu chí (`qa:posters`) & giải mã pixel QR

1. **Khớp Nguồn chân lý duy nhất (SSOT):** Toàn bộ chữ khóa (`headerLabel`, `index`, `storyBeat`, `title`, `subtitle`, `microNote`, `cta`, `footerEvent`, `sourceLine`) trong 05 SVG khớp 100% với `LacHongSo_Cum1_NQ57_2026/content/campaign-content.json` (`66f6d1d5de5cbb30341209df1aef915b73d07650221990a9ab0dc35594a3a6b2`) và `campaign.config.json`.
2. **Nội dung bắt buộc V2:**
   - Poster `02`: đủ 4 badge `ĐỘNG LỰC PHÁT TRIỂN`, `CON NGƯỜI LÀ TRUNG TÂM`, `5 NỀN TẢNG CỐT LÕI`, `AN TOÀN SỐ`.
   - Poster `03`: đủ `2030`, `2045`, `30%`, `80%`, `50%`, `TOP 30`, `MỤC TIÊU`, `TẦM NHÌN`, cùng nhãn `KHÔNG PHẢI KẾT QUẢ HIỆN TẠI`.
   - Poster `04`: đủ `Cụm 1` và 5 phần việc đề xuất (`HỌC KỸ NĂNG SỐ`, `HỖ TRỢ NGƯỜI DÂN`, `ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN`, `SÁNG TẠO GIẢI PHÁP`, `AN TOÀN THÔNG TIN`).
   - Poster `05`: đủ CTA `ĐỌC NGHỊ QUYẾT GỐC`, CTA phụ `CHỌN MỘT HÀNH ĐỘNG SỐ HỮU ÍCH`, domain `xaydungchinhsach.chinhphu.vn`.
   - Chân trang dùng chung: chứa `Cụm 1` và `22/12/2024`; `0` token giữ chỗ (`{{`, `}}`, `[TBD]`, `Lorem`) và `0` từ khóa lạc đề `20/11`.
3. **Giải mã pixel QR trên ảnh xuất thực tế:** `jsQR` đọc trực tiếp từ mảng RGBA của `05_lan_toa_1080x1350.png` giải mã thành công ngay tức thì ra đúng chuỗi:
   `https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm`

---

## 3. Kiểm tra bảo toàn Huy hiệu Đoàn & khả năng đọc ở tỷ lệ 25% trên di động

- **Bảo toàn Huy hiệu Đoàn TNCS Hồ Chí Minh:**
  - Dùng nguyên bản tệp tách nền sắc nét `huy-hieu-doan-clean.png` (`941 × 1042 px` RGBA, `598,535 B`, `interior_max_rgb_diff = 0` so với `huy-hieu-doan-original.jpg`), đặt trên nền trắng bo góc tại đúng tọa độ `(64, 56)` kích thước `84 × 93 px` trên cả 05 SVG/PNG.
  - Tệp PNG thứ hai của người dùng (`huy-hieu-doan-user-png.png`, `250 × 275 px`, `71,672 B`) được lưu trữ nguyên vẹn trong `identity/original/` và `public/assets/identity/original/` để đối chiếu.
  - Logo Hội Sinh viên Việt Nam: `hoiSinhVienLogoAvailable = false` (không dùng AI vẽ lại hay ghép khung giả).
- **Kiểm định trực quan `MOBILE_READABILITY_25PCT.png` (`270 × 338 px` / poster):**
  - Toàn bộ tiêu đề chính (`NGHỊ QUYẾT 57 GẦN BẠN THẾ NÀO?`, `HIỂU ĐÚNG ĐỊNH HƯỚNG`, `2030 → 2045: TẦM NHÌN SỐ`, `THANH NIÊN CỤM 1 HÀNH ĐỘNG`, `HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.`) đọc rõ nét ở quy mô màn hình điện thoại 25%.
  - Tranh minh họa 2D gouache không bị cắt đầu, cắt tay hay che mặt nhân vật: cụm số liệu `2030 → 2045` trên Poster `03` nằm gọn vùng trời trống phía trên (`y = 310..660`) không đè lên hai nhân vật (`y >= 668`) hay đàn chim Lạc (`x >= 804`); 5 viên thuốc hành động trên Poster `04` và thẻ QR trên Poster `05` nằm gọn dưới mặt bàn và cuốn sổ xanh (`y <= 1056`).
