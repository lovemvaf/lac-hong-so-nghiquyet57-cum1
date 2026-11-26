# DANH MỤC CHỜ NHÓM DUYỆT & PHẢN BIỆN (`TEAM_REVIEW_REQUIRED.md`)

- **Dự án:** `LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1`
- **Trạng thái tổng thể:** `DRAFT_PENDING_TEAM_DETAILS` (`CHO_NHOM_DUYET`)
- **Hạn nộp toàn đội theo Đề thi:** **`21:00 ngày 26/11/2026`** | **Trình bày & Phản biện:** Sáng `27/11/2026` (06 phút trình bày + 04 phút phản biện)

---

## 1. Các nội dung thiết kế & nội dung đã khóa nguồn (`CHO_NHOM_DUYET`)

Trước khi chạy xuất bản V2 cho 5 poster và website, đề nghị Đội trưởng và toàn nhóm xác nhận nhanh 4 điểm sau:

1. **Bộ 05 ấn phẩm đồng bộ tên tệp & chủ đề (`1080 × 1350 px`):**
   - `01_dat_cau_hoi_1080x1350.png` — *NGHỊ QUYẾT 57 GẦN BẠN THẾ NÀO?*
   - `02_quan_diem_cot_loi_1080x1350.png` — *HIỂU ĐÚNG ĐỊNH HƯỚNG* (4 badge Mục I: `ĐỘNG LỰC PHÁT TRIỂN`, `CON NGƯỜI LÀ TRUNG TÂM`, `5 NỀN TẢNG CỐT LÕI`, `AN TOÀN SỐ`)
   - `03_muc_tieu_2030_tam_nhin_2045_1080x1350.png` — *2030 → 2045: TẦM NHÌN SỐ* (minh họa mới `03_vision_2030_2045_raw.png`, gắn micro-note *MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)*)
   - `04_thanh_nien_cum1_hanh_dong_1080x1350.png` — *THANH NIÊN CỤM 1 HÀNH ĐỘNG* (5 phần việc đề xuất: `HỌC KỸ NĂNG SỐ`, `HỖ TRỢ NGƯỜI DÂN`, `ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN`, `SÁNG TẠO GIẢI PHÁP`, `AN TOÀN THÔNG TIN`)
   - `05_lan_toa_1080x1350.png` — *HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.* (CTA `ĐỌC NGHỊ QUYẾT GỐC` + `CHỌN MỘT HÀNH ĐỘNG SỐ HỮU ÍCH` + mã QR)
2. **Đích mã QR chính thức trên Ấn phẩm 05:**
   - URL chính: `https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm` (HTTP 200).
   - URL đối chiếu phụ: `https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm` (HTTP 200).
3. **Tách biệt thông điệp sáng tạo và văn kiện:** Khẳng định *"Lạc Hồng số"* và *"Hiểu đúng. Làm thật. Lan tỏa."* là ý tưởng truyền thông của nhóm Cụm 1, không phải tên gọi hay câu nguyên văn trong Nghị quyết 57-NQ/TW.
4. **Rà soát 2 điểm kịch bản Excel:** Chỉnh lời thoại `SCRIPT!C3` (làm rõ QR là công cụ do nhóm tạo trên ấn phẩm) và duyệt gợi ý lời thoại `SHORT 3` (`C6`) / `SHORT 4` (`C8`) tại [VIDEO_SHORT3_SHORT4_SUGGESTIONS.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/VIDEO_SHORT3_SHORT4_SUGGESTIONS.md).

---

## 2. Thông tin Cụm 1 còn `CHƯA XÁC NHẬN` (Nhóm tự điền trước khi nộp)

Kiểm tra trực tiếp `DeThi_VongThucChien_TraiThanhNienSo2026_v2_BanIn.docx` và `TRẠI THANH NIÊN SỐ.xlsx` cho thấy các thông tin định danh sau **chưa có trong tệp đầu vào**, đang giữ `null` trong JSON và **tuyệt đối không tự bịa**:

| Trường thông tin | Giá trị hiện tại | Yêu cầu hành động của nhóm |
|---|---|---|
| **Đội số (`doiSo`)** | `CHƯA XÁC NHẬN` (`null`) | Đội trưởng điền theo Phiếu đăng ký nộp Tổ Thư ký (trước `15:30` ngày `26/11/2026`) và đặt tên thư mục nộp bài `Doi[số đội]_ChuDe1`. |
| **Cụm đơn vị (`cumDonVi`)** | **`Cụm 1`** *(đã xác nhận)* | Kiểm tra khớp tên đơn vị trên Phiếu đăng ký. |
| **Địa bàn cụ thể (`diaBanCuThe`)** | `CHƯA XÁC NHẬN` (`null`) | Bổ sung tên xã/phường/đơn vị trực thuộc Cụm 1 mà đội chọn làm điểm tựa triển khai thực tế trong Bài đăng Word và Thuyết minh (theo yêu cầu Mục I Đề thi). |
| **Họ tên Đội trưởng (`doiTruong`) & SĐT** | `CHƯA XÁC NHẬN` (`null`) | Điền vào Phiếu đăng ký và thông tin đại diện nộp bài. |
| **Logo Hội Sinh viên Việt Nam** | `CHƯA CÓ FILE GỐC` (`false`) | Giữ nguyên chỉ dùng **Huy hiệu Đoàn TNCS Hồ Chí Minh** (`huy-hieu-doan-clean.png`), **không** ghép logo ngoài luồng không rõ nguồn gốc. |

---

## 3. Gợi ý đồng bộ cho Mục 3 — Bài đăng mạng xã hội (tệp Word của đồng đội)

> Ghi chú: Phần này là **khung gợi ý đồng bộ nội dung** để thành viên phụ trách **Mục 3 (01 tệp Word)** tự hoàn thiện và chèn thông tin địa bàn Cụm 1; nhóm thiết kế **không** tự ý xuất tệp `.docx` thay đồng đội.

- **Tiêu đề gợi ý (đồng bộ `SCRIPT!E2` & `NQ57-01`):** *Nghị quyết 57-NQ/TW gần thanh niên Cụm 1 thế nào? Hiểu đúng để làm thật từ một việc nhỏ hôm nay!*
- **Bố cục 5 đoạn khớp đúng 5 poster trượt (`01/05` → `05/05`):**
  1. *Đặt vấn đề (`01/05`):* Dùng smartphone, mạng xã hội, AI mỗi ngày — nhưng bạn đã từng ngại đọc văn kiện dài hoặc lúng túng khi hỗ trợ người thân làm dịch vụ công trực tuyến, kiểm chứng tin giả, bảo vệ dữ liệu cá nhân chưa?
  2. *Hiểu đúng định hướng (`02/05`):* Tóm tắt 4 điểm cốt lõi từ Mục I Nghị quyết 57-NQ/TW (ban hành `22/12/2024`): Động lực phát triển — Người dân và doanh nghiệp là trung tâm — 5 nền tảng cốt lõi (Thể chế, Nhân lực, Hạ tầng, Dữ liệu, Công nghệ chiến lược) — An toàn số xuyên suốt.
  3. *Nhìn rõ cột mốc 2030 → 2045 (`03/05`):* Nêu rõ đây là **mục tiêu định hướng của văn kiện** (kinh tế số tối thiểu `30% GDP` vào 2030 và `50% GDP` vào 2045; `> 80%` dịch vụ công trực tuyến; Top 3 ĐNA về năng lực cạnh tranh số, Chính phủ điện tử và AI R&D; `2% GDP` chi cho R&D).
  4. *Thanh niên Cụm 1 hành động (`04/05`):* Kêu gọi đoàn viên chọn tham gia 5 nhóm phần việc đề xuất: Học kỹ năng số — Hỗ trợ người dân — Ứng dụng trong công tác Đoàn — Sáng tạo giải pháp — Giữ vững an toàn thông tin.
  5. *Lan tỏa & CTA (`05/05`):* *Hiểu đúng. Làm thật. Lan tỏa.* Quét mã QR trên ảnh `05/05` hoặc truy cập [Cổng TTĐT Chính phủ](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm) để đọc toàn văn, bình luận 01 kỹ năng hoặc việc nhỏ bạn sẽ làm tuần này.
- **Các trường thực thi cần thành viên Mục 3 tự điền vào tệp Word theo Đề thi:**
  - Kênh đăng dự kiến: *Fanpage Đoàn xã/phường thuộc Cụm 1 (`CHƯA XÁC NHẬN tên Fanpage cụ thể`)*
  - Khung giờ đăng dự kiến: *`CHƯA XÁC NHẬN` (gợi ý khung giờ tương tác tốt buổi tối 19:30–20:30)*
  - Tài sản đi kèm ghi rõ trong Word: *`01 video MP4 9:16 (60–120s)` + `bộ 05 ấn phẩm PNG 1080×1350 (01..05)`*
  - Hashtag gợi ý: `#NghiQuyet57 #LacHongSo #ThanhNienCum1 #TraiThanhNienSoDongNai2026 #HieuDungLamThatLanToa`

---

## 4. Bộ 8 câu hỏi & phương án trả lời phản biện trước Ban Giám khảo (Section 09.2 — Tối đa 04 phút)

### Câu 1: Vì sao bộ 5 poster không đưa toàn bộ 7 nhóm nhiệm vụ và mọi chỉ tiêu định lượng của Nghị quyết 57-NQ/TW lên ảnh?
- **Đáp án:** Áp dụng đúng nguyên tắc tập huấn truyền thông của Trại (*"xác định người xem muốn nhớ điều gì, tránh nhồi chữ gây lan man"*), poster `1080 × 1350 px` giữ vai trò **cánh cửa dẫn nhập trực quan** để đoàn viên xem trên điện thoại không bị ngợp. Trên Poster `02` và `03`, nhóm chọn lọc đúng các quan điểm và mục tiêu tiêu biểu nhất, giữ nguyên con số chính xác; còn trọn vẹn **7 nhóm nhiệm vụ (nhóm thành 4 trụ)**, phần diễn giải chi tiết và link **toàn văn văn bản gốc qua mã QR** được đồng bộ đầy đủ trong Thuyết minh, Video và Website trình chiếu để người xem tra cứu sâu ngay khi cần.

### Câu 2: Cụm từ *"Lạc Hồng số"* và khẩu hiệu *"Hiểu đúng. Làm thật. Lan tỏa."* có nằm trong văn bản Nghị quyết 57-NQ/TW không?
- **Đáp án:** **Không ạ.** Đội xin minh bạch rõ: *"Lạc Hồng số"* (gắn hình ảnh Trống đồng Đông Sơn, Chim Lạc tiết chế kết hợp thanh niên thời đại số) và thông điệp *"Hiểu đúng. Làm thật. Lan tỏa."* là **ý tưởng sáng tạo truyền thông của đội Cụm 1** để đưa Nghị quyết đến gần người trẻ hơn. Mọi trích dẫn chính sách, mốc năm và chỉ tiêu định lượng trong bộ ấn phẩm đều được tách bạch rõ khỏi phần thông điệp sáng tạo và đối chiếu từng chữ với văn bản gốc ngày `22/12/2024` của Bộ Chính trị.

### Câu 3: Các con số `30% GDP`, `> 80%`, `Top 3 ĐNA`, `2% GDP`, `50% GDP` trên Poster 03 là kết quả đã đạt được hay mục tiêu? Tại sao cần tách bạch `> 80%` dịch vụ công trực tuyến với `80%` giao dịch không dùng tiền mặt?
- **Đáp án:** Đây hoàn toàn là **Mục tiêu đến năm 2030** (`Mục II.1`) và **Tầm nhìn đến năm 2045** (`Mục II.2`) trong Nghị quyết 57-NQ/TW, **không phải kết quả hiện tại**. Ngay trên Poster `03` đội đặt dòng ghi chú nguyên văn: *MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)*. Trong cùng một câu của Mục II.1, Nghị quyết quy định dịch vụ công trực tuyến đạt **trên 80%** (`> 80%`) còn giao dịch không dùng tiền mặt **đạt 80%**, nên đội tách bạch chính xác hai mốc này trong tài liệu thuyết minh, tuyệt đối không viết gộp sai lệch văn kiện.

### Câu 4: Năm hành động trên Poster 04 (`Học kỹ năng số`, `Hỗ trợ người dân`, `Ứng dụng công tác Đoàn`, `Sáng tạo giải pháp`, `An toàn thông tin`) đã được đội triển khai thực tế hay có số liệu thống kê chưa?
- **Đáp án:** Tuân thủ nghiêm quy định của Đề thi (*"không bịa đặt số liệu thật, dùng dữ liệu giả lập"*), Poster `04` gắn nhãn rõ: **`Đề xuất phần việc thanh niên Cụm 1 (chưa phải thống kê hoạt động đã diễn ra)`**. Năm nhóm phần việc này được đội đề xuất từ tinh thần Mục III.1 (*"học tập số"*), Mục III.4 (*nâng cao năng lực số*), Mục III.5 (*dịch vụ công trực tuyến, chống lừa đảo trực tuyến*) và Mục IV.4 (*vai trò tổ chức chính trị - xã hội hướng dẫn, vận động Nhân dân*), bảo đảm vừa sức để các chi đoàn trong Cụm 1 triển khai ngay sau Trại.

### Câu 5: Nhóm sử dụng AI như thế nào trong bài thi? Có vi phạm bản quyền hay làm sai lệch hình ảnh thật không?
- **Đáp án:** Nhóm sử dụng AI **minh bạch và có kiểm soát**: (1) Dùng công cụ sinh ảnh tạo minh họa 2D bán hiện thực hư cấu (`01`–`05`) làm bối cảnh truyền thông, **không** mô phỏng gương mặt hay giọng nói của lãnh đạo hoặc cá nhân có thật, **không** đưa dữ liệu cá nhân thật của đoàn viên/người dân vào AI công cộng; (2) **Không** để AI tự vẽ chữ tiếng Việt, Huy hiệu Đoàn hay mã QR giả — toàn bộ chữ dùng font mở `Be Vietnam Pro (OFL-1.1)`, Huy hiệu Đoàn dùng nguyên bản tệp gốc được cung cấp, và mã QR được lập trình sinh trực tiếp rồi kiểm thử giải mã bằng `jsQR` để đảm bảo quét thật về trang Chính phủ.

### Câu 6: Vì sao trên góc trên trái 05 ấn phẩm chỉ đặt Huy hiệu Đoàn TNCS Hồ Chí Minh mà không có Logo Hội Sinh viên Việt Nam?
- **Đáp án:** Đề thi Mục II.2 yêu cầu *"đúng nhận diện của Đoàn"*. Trong tài liệu đầu vào do người dùng/tổ công tác cung cấp chỉ có tệp gốc Huy hiệu Đoàn TNCS Hồ Chí Minh (`huy-hieu-doan-original.jpg`), **chưa có tệp chính thức Logo Hội Sinh viên Việt Nam**. Để đảm bảo nguyên tắc tôn trọng chuẩn nhận diện và không tự ý vẽ lại bằng AI hay lấy nguồn trôi nổi kém chất lượng, đội khai báo rõ trạng thái `hoiSinhVienLogoAvailable = false` và sử dụng duy nhất Huy hiệu Đoàn nguyên bản sắc nét (`941 × 1042 px`).

### Câu 7: Nhóm phân biệt thế nào giữa Nghị quyết 57-NQ/TW với các Nghị quyết 03/NQ-CP và 71/NQ-CP của Chính phủ?
- **Đáp án:** Nghị quyết `57-NQ/TW` (ban hành `22/12/2024`) là nghị quyết định hướng chiến lược của **Bộ Chính trị**. Để tổ chức thực hiện, Chính phủ đã ban hành Chương trình hành động tại **Nghị quyết `03/NQ-CP`** (`09/01/2025`) và sửa đổi, cập nhật tại **Nghị quyết `71/NQ-CP`** (`01/04/2025`). Trong bộ sản phẩm tuyên truyền, nhóm giữ ranh giới nguồn rõ ràng: mọi nội dung trên poster là của `57-NQ/TW`; hai văn bản của Chính phủ được lưu trong hồ sơ nguồn như tài liệu đối chiếu triển khai nếu Ban Giám khảo hoặc cán bộ Đoàn cơ sở cần tra cứu sâu lộ trình hành động.

### Câu 8: Video ngắn (Mục 1) nhắc đến *"chỉ cần một cú quét mã QR"* — liệu người xem có hiểu nhầm Nghị quyết 57 chỉ là quét mã QR không?
- **Đáp án:** Đội đã rà soát điểm này trong Ma trận đồng bộ liên nhóm (`CROSS_TEAM_SYNC_MATRIX.md`): văn kiện `57-NQ/TW` **không** nói về quét mã QR, mà mã QR là công cụ cầu nối do nhóm thiết kế đặt trên Ấn phẩm `05` để đoàn viên mở nhanh toàn văn Nghị quyết trên `xaydungchinhsach.chinhphu.vn`. Nhờ rà soát sớm, lời thoại Video `SHORT 1` (`C3`) được hiệu chỉnh lại thành *"quét mã QR trên ấn phẩm để đọc ngay toàn văn Nghị quyết 57"*, giúp truyền thông sinh động mà vẫn chuẩn xác tuyệt đối về mặt chính trị – pháp lý.
