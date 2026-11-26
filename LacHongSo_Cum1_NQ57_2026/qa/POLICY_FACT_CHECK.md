# KIỂM ĐỊNH CHÍNH SÁCH & ĐỐI CHIẾU VĂN KIỆN GỐC (`POLICY_FACT_CHECK.md`)

- **Dự án:** `LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1`
- **Tệp nguồn chân lý kiểm định:** [campaign-content.json](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/campaign-content.json) · [CLAIMS_SOURCE_REGISTER.csv](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/CLAIMS_SOURCE_REGISTER.csv) · [campaign.config.json](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/deliverables/02_ThietKe/campaign.config.json)
- **Trạng thái hồ sơ:** `DRAFT_PENDING_TEAM_DETAILS` (`cumDonVi = "Cụm 1"` đã xác nhận; `doiSo`, `diaBanCuThe`, `doiTruong` giữ `null`).
- **Ngày kiểm chứng trực tiếp:** 27/11/2026

---

## 1. Kết quả đối chiếu các nguồn văn bản nhà nước (HTTP 200)

| Văn bản & Cơ quan ban hành | URL kiểm chứng trực tiếp | Kết quả HTTP | Nguyên tắc tách bạch nguồn |
|---|---|---|---|
| **Nghị quyết số 57-NQ/TW** (`22/12/2024`, Bộ Chính trị) — *Nguồn chính* | `https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm` | **HTTP 200** (gzip `88,490 B` → giải nén `558,685 B`) | Nguồn chính thống cho toàn bộ trích dẫn, chỉ tiêu và đích **mã QR** trên Ấn phẩm `05`. |
| **Nghị quyết số 57-NQ/TW** (`22/12/2024`, Bộ Chính trị) — *Bản đối chiếu Bộ KH&CN* | `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm` | **HTTP 200** (`214,593 B`) | Nguồn đối chiếu chéo song song; toàn văn Phần Mở đầu và Mục I–IV khớp với Cổng TTĐT Chính phủ. |
| **Nghị quyết số 03/NQ-CP** (`09/01/2025`, Chính phủ) — *Chương trình hành động thực hiện NQ 57* | `https://vanban.chinhphu.vn/?docid=212350&pageid=27160` | **HTTP 200** (`85,341 B`) | **Tách biệt hoàn toàn khỏi văn kiện 57-NQ/TW.** Chỉ lưu phục vụ tra cứu triển khai cấp Chính phủ, không gán vào lời của Bộ Chính trị. |
| **Nghị quyết số 71/NQ-CP** (`01/04/2025`, Chính phủ) — *Sửa đổi, bổ sung cập nhật Chương trình hành động* | `https://chinhphu.vn/?classid=0&docid=213308&pageid=27160` | **HTTP 200** (`85,885 B`) | **Tách biệt hoàn toàn khỏi văn kiện 57-NQ/TW.** Không trộn chỉ tiêu thực thi của Chính phủ vào bộ poster tóm tắt 57-NQ/TW. |

---

## 2. Quy tắc tách bạch 5 tầng tuyên bố (`Claim Taxonomy Audit`)

Toàn bộ **42 mục tuyên bố** trong [CLAIMS_SOURCE_REGISTER.csv](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/CLAIMS_SOURCE_REGISTER.csv) được phân loại rành mạch, **không có mục nào chưa kiểm chứng (`0 UNVERIFIED`)**:

1. **`policy_fact`** — Sự kiện, nhận định, quan điểm chỉ đạo và tên nhiệm vụ khớp trực tiếp văn kiện `57-NQ/TW` (hoặc tài liệu ban hành hợp pháp tách riêng như `03/NQ-CP`, `71/NQ-CP`, quy định Đề thi BTC).
2. **`official_target`** — Chỉ tiêu định lượng đến năm `2030` (`Mục II.1`) và tầm nhìn đến năm `2045` (`Mục II.2`) trên Poster `NQ57-03`, đi kèm nhãn chống hiểu nhầm: *MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)*.
3. **`interpretation`** — Tên chiến dịch (`Lạc Hồng số`), thông điệp sáng tạo (`Hiểu đúng. Làm thật. Lan tỏa.`), tiêu đề khơi gợi (`NGHỊ QUYẾT 57 GẦN BẠN THẾ NÀO?`) và khẩu hiệu video `SCRIPT!C10`; công bố minh bạch trong `conceptNotice` không phải ngôn từ chính thức của Bộ Chính trị.
4. **`youth_action_suggestion`** — Năm nhóm phần việc thanh niên Cụm 1 trên Poster `NQ57-04` (đồng bộ Excel `F8:K8`) và lời mời quét QR đọc văn bản gốc trên Poster `NQ57-05`; gắn nhãn rõ đây là đề xuất hành động, **không** báo cáo như số liệu hoạt động đã diễn ra.
5. **`illustrative_scene`** — Tình huống hội thoại mở đầu (`SCRIPT!C2`) và toàn bộ 05 tranh minh họa 2D bán hiện thực hư cấu có hỗ trợ AI (`source_illustrations/`), hoàn toàn là giả lập truyền thông.

---

## 3. Kiểm tra chính xác từng ấn phẩm V2 (`NQ57-01` .. `NQ57-05`)

- **`NQ57-01` (`01_dat_cau_hoi_1080x1350.png`):** Khẳng định đúng ngày ban hành `22/12/2024`, cơ quan ban hành `Bộ Chính trị`, thực trạng nhận thức chuyển đổi số nêu tại Phần Mở đầu, giữ ranh giới giả lập cho tình huống thanh niên. **PASS.**
- **`NQ57-02` (`02_quan_diem_cot_loi_1080x1350.png`):** Khớp trực tiếp Mục I qua 4 badge:
  - `ĐỘNG LỰC PHÁT TRIỂN` (`Mục I.1`): đột phá quan trọng hàng đầu, động lực chính.
  - `CON NGƯỜI LÀ TRUNG TÂM` (`Mục I.2`): người dân và doanh nghiệp là trung tâm, chủ thể, nguồn lực, động lực chính; nhà khoa học là nhân tố then chốt.
  - `5 NỀN TẢNG CỐT LÕI` (`Mục I.3`): thể chế, nhân lực, hạ tầng, dữ liệu và công nghệ chiến lược.
  - `AN TOÀN SỐ` (`Mục I.5`): bảo đảm chủ quyền quốc gia trên không gian mạng, an ninh mạng, an ninh dữ liệu, an toàn thông tin.
  - *(Bổ sung Mục I.4 về tự chủ công nghệ trong `speakerNotes` và thuyết minh để đầy đủ cả 5 quan điểm.)* **PASS.**
- **`NQ57-03` (`03_muc_tieu_2030_tam_nhin_2045_1080x1350.png`):**
  - Nhóm 2030 (`Mục II.1`): `>= 30% GDP` quy mô kinh tế số; `> 80%` người dân & doanh nghiệp dùng dịch vụ công trực tuyến *(tách biệt rõ với `đạt 80%` giao dịch không dùng tiền mặt)*; `TOP 3 ĐNA · TOP 50 THẾ GIỚI` năng lực cạnh tranh số & Chính phủ điện tử *(bổ sung `Top 3 ĐNA về nghiên cứu và phát triển AI` từ cùng câu trong văn bản gốc)*; `2% GDP` kinh phí chi R&D *(ghi chú thêm cơ cấu `> 60%` từ xã hội)*.
  - Nhóm 2045 (`Mục II.2`): `>= 50% GDP` quy mô kinh tế số; `TOP 30 THẾ GIỚI` đổi mới sáng tạo và chuyển đổi số; định hướng `NƯỚC PHÁT TRIỂN, THU NHẬP CAO`.
  - Kèm micro-note bắt buộc chống nhầm lẫn thành kết quả hiện tại. **PASS.**
- **`NQ57-04` (`04_thanh_nien_cum1_hanh_dong_1080x1350.png`):** Đồng bộ `SCRIPT!F8:K8` thành 5 nhóm đề xuất (`HỌC KỸ NĂNG SỐ`, `HỖ TRỢ NGƯỜI DÂN`, `ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN`, `SÁNG TẠO GIẢI PHÁP`, `AN TOÀN THÔNG TIN`), gắn micro-note *Đề xuất phần việc thanh niên Cụm 1 (chưa phải thống kê hoạt động đã diễn ra)*. **PASS.**
- **`NQ57-05` (`05_lan_toa_1080x1350.png`):** Giữ khẩu hiệu sáng tạo `HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.` + CTA `ĐỌC NGHỊ QUYẾT GỐC` + CTA phụ `CHỌN MỘT HÀNH ĐỘNG SỐ HỮU ÍCH` + QR trỏ về `xaydungchinhsach.chinhphu.vn`. **PASS.**

---

## 4. Kiểm tra các điểm sửa lệch so với Excel gốc & chống bịa đặt

- [x] Phát hiện và xử lý lệch nhãn `SCRIPT!B6` (`18s-35s (Những mục tiêu lớn)` đặt cạnh `F6:M6` 7 nhiệm vụ) và 2 ô thoại bỏ trống `C6`, `C8` trong [CROSS_TEAM_SYNC_MATRIX.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/CROSS_TEAM_SYNC_MATRIX.md).
- [x] Làm rõ QR ở `SCRIPT!C3` là giải pháp truyền thông do nhóm thiết kế bổ sung, không phải quy định trong văn bản 57-NQ/TW.
- [x] Không tự bịa `doiSo`, `diaBanCuThe`, `doiTruong` (giữ `null` trong JSON / `CHƯA XÁC NHẬN` trong markdown) và không chừa ký tự giữ chỗ trên ấn phẩm.
- [x] Không tự bịa Logo Hội Sinh viên Việt Nam (`hoiSinhVienLogoAvailable = false`), dùng duy nhất Huy hiệu Đoàn nguyên bản `941 × 1042 px` (`huy-hieu-doan-clean.png`).
- [x] Không chỉnh sửa tệp `.xlsx` của người dùng hay giả lập nộp hộ sản phẩm Mục 1, Mục 3, Mục 4 của thành viên khác.
