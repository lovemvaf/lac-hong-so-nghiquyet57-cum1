# NHẬT KÝ THAY ĐỔI NỘI DUNG (`CHANGELOG_CONTENT.md`)

Tài liệu ghi lại toàn bộ thay đổi từ bản **V1** (lưu nguyên trạng ảnh kiểm chứng tại `LacHongSo_Cum1_NQ57_2026/qa/before_v1/`) sang bản **V2 Content Lock & Cross-Team Sync** (`LacHongSo_Cum1_NQ57_2026/content/campaign-content.json`).

---

## V2 (27/11/2026) — Khóa Single Source of Truth, Đối chiếu toàn văn Chính phủ & Đồng bộ Liên nhóm

### 1. Thiết lập Nguồn chân lý duy nhất (SSOT) & Tách bạch ranh giới
- Khởi tạo thư mục chuẩn hóa `LacHongSo_Cum1_NQ57_2026/content/` với tệp lõi `campaign-content.json` (đồng bộ từng byte sang `src/content/campaign-content.json`) và đồng bộ `deliverables/02_ThietKe/campaign.config.json`.
- Gắn trường `conceptNotice` công khai khẳng định *"Lạc Hồng số"* và *"Hiểu đúng. Làm thật. Lan tỏa."* là ý tưởng truyền thông của nhóm Cụm 1, tách biệt hoàn toàn với ngôn từ chính thức của Bộ Chính trị.
- Chốt phân loại 5 tầng dữ liệu (`policy_fact`, `official_target`, `interpretation`, `youth_action_suggestion`, `illustrative_scene`) trong `CLAIMS_SOURCE_REGISTER.csv`.

### 2. Chuyển URL chính thức ưu tiên & tách bạch văn bản Chính phủ
- Đặt **`https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm`** (Cổng TTĐT Chính phủ, HTTP 200) làm **`officialResolutionUrl`** chính cho mã QR và trích dẫn chính.
- Giữ **`https://mst.gov.vn/...197250813164610621.htm`** (Cổng TTĐT Bộ KH&CN, HTTP 200) làm **`secondaryOfficialUrl`** để đối chiếu song song.
- Bổ sung và tách biệt rõ 2 văn bản triển khai cấp Chính phủ (`03/NQ-CP` ngày `09/01/2025` và `71/NQ-CP` ngày `01/04/2025`, đều đã kiểm tra HTTP 200), không trộn lẫn thành nội dung văn kiện `57-NQ/TW`.

### 3. Cập nhật cấu trúc & nội dung 05 ấn phẩm (`NQ57-01` .. `NQ57-05`)

| Mã | V1 (`deliverables/02_ThietKe/`) | V2 (Khóa mới trong SSOT) | Lý do đồng bộ |
|---|---|---|---|
| **NQ57-01** | `01_KhoiNguonNhanThuc.png`<br>*NGHỊ QUYẾT 57 GẦN THANH NIÊN THẾ NÀO?* | `01_dat_cau_hoi_1080x1350.png`<br>**NGHỊ QUYẾT 57 GẦN BẠN THẾ NÀO?**<br>*Từ một câu hỏi nhỏ, mở ra cách nhìn mới.* | Chuẩn hóa tên file gắn kích thước `1080x1350`, giọng trực diện "gần bạn" khớp hook `SHORT 1` và câu hỏi `1/5`. |
| **NQ57-02** | `02_HieuDungNoiDung.png`<br>*HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG* | `02_quan_diem_cot_loi_1080x1350.png`<br>**HIỂU ĐÚNG ĐỊNH HƯỚNG**<br>*Công nghệ vì con người, đổi mới để phát triển.* + **4 badge Mục I** | Khớp trực tiếp Quan điểm chỉ đạo (`Mục I.1, I.2, I.3, I.5` & `SCRIPT!F2:L2`), tránh gom sai thành "3 trụ cột duy nhất". |
| **NQ57-03** | V1 đặt *THANH NIÊN HÀNH ĐỘNG* ở số 03 (`03_lhs_raw.png`) | `03_muc_tieu_2030_tam_nhin_2045_1080x1350.png`<br>**2030 → 2045: TẦM NHÌN SỐ** (`03_vision_2030_2045_raw.png`) + `targets2030` & `vision2045` | Đưa toàn bộ khối **Mục tiêu 2030 & Tầm nhìn 2045** (`Mục II.1–II.2`, `SCRIPT!F4:L5`) lên thành một ấn phẩm trung tâm riêng với nhãn chống hiểu nhầm kết quả hiện tại. |
| **NQ57-04** | V1 đặt *TỪ MỘT NGƯỜI ĐẾN CẢ CỘNG ĐỒNG* ở số 04 (`04_lhs_raw.png`) | `04_thanh_nien_cum1_hanh_dong_1080x1350.png`<br>**THANH NIÊN CỤM 1 HÀNH ĐỘNG** (`03_lhs_raw.png`) + **5 badge** đồng bộ `F8:K8` | Đẩy mạch hành động thanh niên về đúng nhịp `SHORT 4 (35-50s)` và câu hỏi `5/5`, bổ sung `AN TOÀN THÔNG TIN` gắn thực tiễn sinh viên/thanh niên. |
| **NQ57-05** | `05_KhatVongLacHongSo.png` (`05_lhs_raw.png`) | `05_lan_toa_1080x1350.png`<br>**HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.** (`04_lhs_raw.png`) + CTA phụ `CHỌN MỘT HÀNH ĐỘNG SỐ HỮU ÍCH` + QR `chinhphu.vn` | Đưa cảnh lan tỏa cộng đồng (`04_lhs_raw.png`) làm cái kết giàu tính cộng đồng và đồng bộ thông điệp chốt `SHORT 5`. |

### 4. Khắc phục các lỗi chênh lệch trong `TRẠI THANH NIÊN SỐ.xlsx` & bổ sung tài liệu liên nhóm
- Phát hiện và đề xuất sửa lỗi lệch nhãn `SCRIPT!B6` (`18s-35s (Những mục tiêu lớn)` đặt trên hàng `F6:M6` 7 nhiệm vụ), bổ sung gợi ý cho 2 ô thoại trống `C6` và `C8` kèm tính toán tốc độ đọc `2,5–3,0 từ/giây`.
- Hiệu chỉnh framing QR ở `SCRIPT!C3` để không gán quy định quét mã QR vào văn kiện gốc.
- Bổ sung từ văn bản gốc các ý bị sót trong Excel: `Top 3 ĐNA về nghiên cứu và phát triển trí tuệ nhân tạo (AI)`, phân biệt `> 80%` dịch vụ công trực tuyến với `80%` giao dịch không dùng tiền mặt, cơ cấu `> 60%` kinh phí xã hội hóa trong `2% GDP` R&D, quan điểm `Mục I.4` tự chủ công nghệ và cụm chuẩn `các cơ quan trong hệ thống chính trị` (`Mục III.5`).
- Lưu trữ và kiểm định đầy đủ bản PNG bổ sung `huy-hieu-doan-user-png.png` (`250 × 275 px`), tiếp tục giữ bản chất lượng cao `huy-hieu-doan-clean.png` (`941 × 1042 px`) cho ấn phẩm.
- Bổ sung kiểm định trung thực các kho mã nguồn cục bộ (`.research/repos`: 43 thư mục; `_repos`: 32 thư mục; `_writing_repos`: 33 thư mục).

---

## V1 (26/11/2026) — Khởi tạo & Triển khai đầu tiên
- Tách độc lập dự án khỏi `net-ve-tri-an-dntu-2026`, xuất 5 poster `1080 × 1350 px` bản V1, dựng web triển lãm 7 giai đoạn và lưu ảnh chụp hiện trạng V1 tại `LacHongSo_Cum1_NQ57_2026/qa/before_v1/`.
