# ILLUSTRATION NOTES — LẠC HỒNG SỐ (BỘ 05 ẤN PHẨM NGHỊ QUYẾT 57-NQ/TW)

> **Dự án:** `lac-hong-so-nghiquyet57-cum1` — *LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1*  
> **Trạng thái sản xuất:** **HOÀN TẤT Phase 3A** (`source_illustrations/` gồm đủ `character-style-sheet-lhs.png` + `01_lhs_raw.png`..`05_lhs_raw.png`; toàn bộ `6/6` tệp đạt chuẩn **PASS** qua kiểm định `read_file`, zoom cận cảnh giải phẫu và mô phỏng khung `4:5`).  
> **Tuyên bố minh bạch AI:** Toàn bộ tranh nền trong `deliverables/02_ThietKe/source_illustrations/` là **minh họa 2D bán hiện thực hư cấu được tạo sinh với sự hỗ trợ của công cụ AI**, dưới sự chỉ đạo art direction, kiểm định liên tục nhân vật, kiểm tra giải phẫu cận cảnh và đối chiếu vùng an toàn khung `4:5` (`1080 × 1350 px`) của nhóm thiết kế. Nhân vật, trang phục, không gian và hoạt động cộng đồng đều là **tình huống giả lập truyền thông / gợi ý phần việc thanh niên Cụm 1**, không sử dụng ảnh chụp người thật và không phải ảnh tư liệu sự kiện đã diễn ra.

---

## 1. Quy chuẩn khóa phong cách, bảng màu & bản sắc LẠC HỒNG SỐ

- **Phong cách khóa:** `Vietnamese 2D semi-realistic editorial gouache + crisp dark-ink linework` — nét mực mảnh sắc sảo, mảng màu gouache lì ấm áp trên nền kem giấy (`#F7F3E8`), tỷ lệ giải phẫu tự nhiên; **tuyệt đối không** photorealism, ảnh chụp, 3D/CGI, cyberpunk, ánh sáng neon rực, hay biếm họa/hoạt hình phóng đại.
- **Bản sắc văn hóa Lạc Hồng Số:** Họa tiết **trống đồng Đông Sơn** hiện đại hóa (nét vàng ấm mảnh thanh thoát, sao 12 cánh và vòng tròn đồng tâm tiết chế) kết hợp **chim Lạc / hạc Việt** bay vươn lên nhẹ nhàng — giữ vai trò tôn nền văn hóa thanh lịch, **tuyệt đối không** lấn át nhân vật thanh niên và tinh thần Nghị quyết 57-NQ/TW.
- **Bảng màu đồng bộ (`campaign.config.json`):**
  - Xanh thanh niên (`youthBlue`): `#1464B4`
  - Xanh hải quân đậm (`deepNavy`): `#0D2B52`
  - Đỏ nhấn (`redAccent`): `#D62828`
  - Vàng ấm (`warmGold`): `#F0C14B`
  - Kem giấy ấm (`warmCream`): `#F7F3E8`
  - Xanh lục trầm (`deepGreen`): `#0E5A38`
- **Nguyên tắc tách lớp chữ & nhận diện:** `100%` tranh nền không chứa chữ cái, chữ số, ký tự giả, huy hiệu Đoàn/Hội Sinh viên tự vẽ, logo đơn vị hay mã QR giả. Toàn bộ tiêu đề (`Be Vietnam Pro`), huy hiệu Đoàn gốc (`huy-hieu-doan-clean.png`), nguồn trích dẫn và mã QR hợp lệ (`mst.gov.vn`) được ghép ở lớp vector/SVG (`deliverables/02_ThietKe/editable/01.svg`..`05.svg`).
- **Vùng an toàn khung `4:5` (`1080 × 1350 px`):**
  - Góc trên trái `(64, 56)` dành chỗ cho huy hiệu Đoàn nguyên bản + dải header `NGHỊ QUYẾT 57-NQ/TW` + vùng tiêu đề/phụ đề phía trên (`~24%` chiều cao khung trên sạch, không cắt đỉnh đầu nhân vật).
  - Vùng đáy khung (`~14%` chiều cao phía dưới) sạch cho footer `Cụm 1 · Trại Thanh niên số thành phố Đồng Nai 2026` và nguồn Nghị quyết.
  - Riêng **Ấn phẩm 05 (`KHÁT VỌNG LẠC HỒNG SỐ`)** cần thêm vùng trống rộng rãi ở góc dưới/dưới-trái cho thẻ CTA `QUÉT MÃ ĐỌC NGHỊ QUYẾT GỐC` và mã QR.

### Bộ 04 nhân vật hư cấu & đạo cụ lặp lại

1. **Nữ thanh niên / sinh viên (~21 tuổi):** Tóc đen ngang vai mái thưa nhẹ, áo sơ mi kem/trắng ngà xắn tay gọn gàng, túi đeo chéo vải canvas xanh navy, quần tối màu.
2. **Nam đoàn viên tình nguyện (~22 tuổi):** Tóc đen ngắn gọn gàng, áo polo xanh thanh niên trơn (`#1464B4`, **không** logo/huy hiệu giả trên ngực), quần tối màu.
3. **Người cao tuổi / bác gái (~65 tuổi):** Tóc hoa râm búi gọn phía sau, áo bà ba/cổ tròn nút giữa họa tiết hoa văn nhã nhặn tông xanh xám–kem vàng dịu, quần tối màu, dép quai ngang tối màu; thần thái điềm đạm, tự tin.
4. **Hàng xóm / tiểu thương cộng đồng (~40–50 tuổi):** Nam trung niên áo thun nâu cam đất trơn cổ tròn, quần tối màu, dép quai ngang tối màu; nét mặt thân thiện, gần gũi đời sống Đồng Nai.
5. **Đạo cụ xuyên suốt:** Điện thoại thông minh viền tối màu (màn hình sáng ấm trung tính, không UI chữ giả) + sổ tay bìa cứng xanh navy có dây đai và dây đánh dấu đỏ nhỏ.

---

## 2. Nhật ký sinh ảnh & kiểm định chất lượng từng tệp

### 00. `character-style-sheet-lhs.png` — Bảng tham chiếu nhân vật, họa tiết & đạo cụ Lạc Hồng Số

- **Kích thước / Định dạng thực tế:** `1376 × 768 px`, RGB PNG (`1,333,914 bytes`).
- **Quy trình kiểm tra:** Đọc trực tiếp qua `read_file` kết hợp cắt zoom cận cảnh nửa trái, nửa phải, vùng tay/chân hai nhân vật người dân và cụm họa tiết Đông Sơn/chim Lạc.
- **Kết quả kiểm định:** **PASS**
  - **Phong cách & bảng màu:** Thuần 2D editorial gouache + nét mực tối sắc nét trên nền kem `#F7F3E8`; không photorealism, không 3D, không neon/cyberpunk, không biếm họa.
  - **Độ nhất quán 04 nhân vật & giải phẫu:**
    - *Nữ thanh niên:* Đúng áo kem xắn tay + túi chéo navy + quần tối; tay phải giữ dây túi và tay trái buông tự nhiên đều đủ 5 ngón, tỷ lệ gương mặt thuần Việt hài hòa.
    - *Nam đoàn viên:* Đúng áo polo xanh `#1464B4` trơn hoàn toàn (0 huy hiệu/logo giả trên ngực), hai tay buông hai bên cân đối, đủ ngón tự nhiên.
    - *Bác gái (~65 tuổi):* Tóc hoa râm búi gọn, áo hoa văn xanh xám–kem dịu, quần tối; hai bàn tay và hai bàn chân mang dép tách bạch, đúng số ngón.
    - *Người dân / tiểu thương nam:* Áo thun nâu cam đất trơn, quần tối, dép tối; tay trái 5 ngón rõ ràng, chân/dép tự nhiên.
  - **Họa tiết Lạc Hồng Số & đạo cụ:** Trống đồng Đông Sơn nét vàng mảnh (sao 12 cánh + vòng chim cách điệu + đường cong đồng tâm góc), 3 chim Lạc sải cánh thanh thoát, điện thoại màn hình trơn và sổ tay navy dây đỏ đều sạch tuyệt đối (**0 chữ, 0 số, 0 ký tự giả, 0 QR giả**).

---

### 01. `01_lhs_raw.png` — Ấn phẩm 01: KHỞI NGUỒN NHẬN THỨC (*NGHỊ QUYẾT 57 GẦN THANH NIÊN THẾ NÀO?*)

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ `0.7467`), RGB PNG (`1,422,116 bytes`).
- **Tọa độ thực tế các điểm neo quan trọng trong ảnh gốc (`896 × 1200`):**
  - Đàn chim Lạc góc trên phải: `x = 698..861, y = 41..204` (cánh chim cao nhất chạm `y = 41`).
  - Đỉnh đầu cao nhất (nam thanh niên đeo kính đứng giữa): `y = 360` (`30.0%` từ mép trên).
  - Đỉnh dưới cùng của quyển phác thảo bóng đèn (mũi nhọn mép dưới): `x = 519, y = 1149` (`95.75%` chiều cao ảnh gốc), trên mặt bàn kéo dài đến `y = 1199`.
- **Tọa độ đặt khung `4:5` (`1080 × 1350 px`) KHÔNG CẮT XÉN cho `editable/01.svg` (`lhs-compositor`):**
  - **Không nên** crop full-bleed `896 × 1120`: nếu lấy `y0 = 80` sẽ cắt mất phần đầu/cánh chim Lạc cao nhất (`y = 41..79`) và đưa mũi sổ phác thảo xuống `y = 1288` (vào vùng footer); còn nếu lấy `y0 = 20` (`y1 = 1140`) sẽ cắt mũi nhọn sổ phác thảo (`y = 1149`).
  - **Phương án chuẩn (Non-clipping framed placement trên nền `#F7F3E8`):** Crop nhẹ đáy bàn thừa dưới mũi sổ `(0, 0, 896, 1178)` rồi scale đồng dạng (`1.0357×`) thành **`928 × 1220 px`** đặt tại **`(x = 76, y = 14)`** (bo góc nhẹ `r = 18` hoặc làm mờ nhẹ 2 biên trái/phải vào nền `#F7F3E8`), phía trên dải footer `#0D2B52` (`y = 1246..1350`) — *hoặc* giữ nguyên ảnh gốc `896 × 1200` scale thành `911 × 1220 px` tại `(x = 84, y = 14)`.
  - **Kiểm chứng vùng an toàn sau đặt khung (`1080 × 1350`):**
    - Đàn chim Lạc nằm trọn tại `x = 799..968, y = 56..225` (nguyên vẹn 100%, không chạm huy hiệu Đoàn `(64, 56)` và nằm bên phải vùng tiêu đề/phụ đề canh trái `x = 168..770, y = 56..330`).
    - Đỉnh đầu cao nhất ở `y = 387` (`28.7%` chiều cao poster → vùng trời phía trên rộng thoáng >28% cho header + headline + subtitle).
    - Mũi dưới sổ phác thảo ở `y = 1204` (`30 px` an toàn bên trong mép dưới tranh `1234` và `42 px` phía trên dải footer `y = 1246..1350`).
- **Quy trình kiểm tra:** Đọc trực tiếp via `read_file` + crop zoom cận cảnh 3 gương mặt, 6 bàn tay trên bàn/tài liệu, mép dưới sổ phác thảo, thước đo pixel và giả lập khung `4:5` (`01_sim_editorial_card.png`).
- **Kết quả kiểm định:** **PASS**
  - **Phong cách & bản sắc Lạc Hồng Số:** Thuần 2D editorial gouache + nét mực tối thanh gọn; mặt trống đồng Đông Sơn nét vàng nhạt làm nền vừa phải sau 3 bạn trẻ + 3 chim Lạc góc trên phải thanh thoát, không sến lễ hội; giữ chủ thể thanh niên & học tập làm trọng tâm.
  - **Nhất quán nhân vật & giải phẫu:**
    - *Nữ sinh (trái):* Khớp tuyệt đối style sheet (tóc đen ngang vai mái thưa, sơ mi kem xắn tay, túi chéo navy, quần tối); hai tay chống bàn đủ 5 ngón tự nhiên mỗi tay.
    - *Nam sinh đeo kính (giữa):* Giữ tập tài liệu với hai bàn tay đủ ngón cân đối; tài liệu chỉ có khối bố cục xám trừu tượng, **0 chữ/số**.
    - *Nam đoàn viên (phải):* Khớp tuyệt đối style sheet (áo polo `#1464B4` trơn không huy hiệu giả, quần tối); hai bàn tay mở hướng về bàn đủ 5 ngón rõ nét.
  - **Ba gợi ý nội dung không chữ:** Điện thoại + tablet màn hình ấm trơn (chuyển đổi số), sổ phác thảo bóng đèn & khối hình học (đổi mới sáng tạo), hộp bo mạch điện tử nhỏ (khoa học & công nghệ), cùng sổ navy có dây đánh dấu đỏ. **100% không chữ, không số, không logo/huy hiệu giả, không QR giả.**

---

### 02. `02_lhs_raw.png` — Ấn phẩm 02: HIỂU ĐÚNG NỘI DUNG (*HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG*)

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ `0.7467`), RGB PNG (`994,937 bytes`), nền giấy kem đồng nhất `#F8F2E6` (`RGB(248, 242, 230)` — gần khớp tuyệt đối `#F7F3E8`).
- **Tọa độ thực tế các điểm neo quan trọng trong ảnh gốc (`896 × 1200`):**
  - Vùng nội dung vẽ thực tế (`non-bg bbox`): `x = 26..876, y = 225..1060` (tức **18.75%** khoảng trống kem sạch phía trên và **11.7%** khoảng trống kem sạch phía dưới).
  - Mép trên cụm vòng tròn Đổi mới sáng tạo góc trên phải: `y = 225`; mép trên tia trống đồng Đông Sơn: `y = 265`; đỉnh đầu hai nhân vật: `y = 468` (nam) và `y = 492` (nữ); chân bàn phía dưới: `y = 1060`.
- **Tọa độ đặt khung `4:5` (`1080 × 1350 px`) tối ưu cho `editable/02.svg` (`lhs-compositor`):**
  - *Lưu ý tránh chồng lấn nếu crop full-width `y0=80`:* Nếu cắt `(0, 80, 896, 1200)` scale đầy `1080×1350`, mép trên cụm tròn Đổi mới sáng tạo sẽ bị đẩy lên `y = 175`, dễ chạm vào vùng tiêu đề căn giữa (`y = 56..290`).
  - **Phương án khuyến nghị (Centered padded placement trên nền `#F8F2E6`/`#F7F3E8`):** Crop gọn vùng nội dung `(0, 210, 896, 1075)` (`896 × 865 px`) scale đồng dạng (`1.060×`) thành **`950 × 917 px`** đặt tại **`(x = 65, y = 300)`** (làm mờ nhẹ 20 px biên để hòa hoàn toàn vào nền `#F7F3E8`) — *hoặc* giữ nguyên file gốc `896 × 1200` scale thành `950 × 1273 px` tại `(x = 65, y = 77)` (đặt dưới lớp footer).
  - **Kiểm chứng vùng an toàn (`1080 × 1350`):**
    - Toàn bộ dải trên `y = 0..305` (hơn `22.5%` chiều cao, trọn bề ngang `1080 px`) hoàn toàn trống sạch cho huy hiệu Đoàn `(64, 56)`, badge `NGHỊ QUYẾT 57-NQ/TW`, tiêu đề căn giữa `HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG`, phụ đề và `microNote` (`mép trên cụm tròn Đổi mới sáng tạo nằm tại y = 316`).
    - Chân bàn dừng ở `y = 1201` (sạch hoàn toàn trước vùng footer `#0D2B52` từ `y = 1235..1350`).
- **Quy trình kiểm tra:** Đọc trực tiếp via `read_file` + crop zoom cặp nhân vật trung tâm, vùng 4 bàn tay trên dây túi/tablet/thắt lưng, 3 cụm biểu tượng và thước đo pixel.
- **Kết quả kiểm định:** **PASS**
  - **Phong cách & bản sắc Lạc Hồng Số:** Thuần 2D gouache + nét mực tối; trống đồng Đông Sơn đồng tâm lớn (nét vàng ấm + viền xanh thanh niên mảnh) tạo khung quy tụ rất cân đối, không bị nặng nề sến cũ.
  - **Nhất quán nhân vật & giải phẫu:** Cả hai bạn trẻ khớp tuyệt đối `character-style-sheet-lhs.png` và `01_lhs_raw.png` (áo sơ mi kem + túi chéo navy; áo polo `#1464B4` trơn 0 huy hiệu). Bốn bàn tay rõ ràng: tay phải nữ cầm quai túi, tay trái nữ đặt mép tablet (5 ngón rõ), tay trái nam chỉ xuống bàn/sổ tay (đủ ngón tự nhiên), tay phải nam buông tự nhiên sau hông.
  - **Ba cụm gợi nhớ trực quan không chữ (`[02]`):** (1) Trái: lăng kính quang phổ + kính hiển vi + bo mạch (*Khoa học, công nghệ*); (2) Trên-phải: bóng đèn sáng + hoa sen + hạc giấy (*Đổi mới sáng tạo*); (3) Phải: smartphone + tablet nối đám mây (*Chuyển đổi số*). Kết hợp tablet đồ thị hình học + sổ tay dây đỏ trên bàn. **100% không chữ, không số, không logo/huy hiệu giả, không QR giả.**

---

### 03. `03_lhs_raw.png` — Ấn phẩm 03: HÀNH ĐỘNG THIẾT THỰC (*THANH NIÊN HÀNH ĐỘNG*)

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ `0.7467`), RGB PNG (`1,468,283 bytes`).
- **Tọa độ thực tế các điểm neo quan trọng trong ảnh gốc (`896 × 1200`):**
  - Đàn chim Lạc góc trên phải: `x = 680..861, y = 41..238` (cánh chim cao nhất tại `y = 41`).
  - Đỉnh đầu cao nhất (nam đoàn viên bên trái `y = 419`; bác gái trung tâm `y = 424`; nữ sinh `y = 428`) — toàn bộ 6 nhân vật nằm dưới `y = 419` (`34.9%` chiều cao).
  - Sổ tay bìa cứng navy & dây đánh dấu đỏ trên mặt bàn: đáy tại `y ≈ 1005` (`83.75%`), phần mặt bàn gỗ sạch kéo dài xuống `y = 1200`.
- **Tọa độ crop `4:5` (`1080 × 1350 px`) KHÔNG CẮT XÉN cho `editable/03.svg` (`lhs-compositor`):**
  - **Không nên** dùng `y0 = 80` (sẽ cắt mất phần cánh chim Lạc cao nhất ở `y = 41..79`).
  - **Phương án chuẩn (Full-bleed non-clipping 4:5):** Crop **`(0, 18, 896, 1138)`** (`896 × 1120 px`) scale đồng dạng (`1.2054×`) thành **`1080 × 1350 px`**.
  - **Kiểm chứng vùng an toàn (`1080 × 1350`):**
    - Đàn chim Lạc nằm nguyên vẹn tại `x = 820..1038, y = 28..265` (cách mép trên `28 px`, tách biệt hoàn toàn khỏi vùng tiêu đề canh trái `x = 168..810`).
    - Đỉnh đầu cao nhất nằm tại `y = 483` (`35.8%` chiều cao → hơn `35%` vùng trời sáng rộng thoáng cho huy hiệu Đoàn `(64, 56)`, badge `NGHỊ QUYẾT 57-NQ/TW`, tiêu đề `THANH NIÊN HÀNH ĐỘNG`, phụ đề và `microNote`).
    - Đáy sổ tay navy nằm tại `y ≈ 1190`, chừa khoảng gỗ sạch `45–55 px` phía trên dải footer `#0D2B52` (`y = 1235..1350` hoặc `y = 1246..1350`).
- **Quy trình kiểm tra:** Đọc trực tiếp via `read_file` + crop zoom cận cảnh cặp trung tâm & bàn tay cầm điện thoại, hai tiểu cảnh phụ trái/phải, vùng bàn dưới, thước đo pixel và giả lập `03_sim_crop_y18.png`.
- **Kết quả kiểm định:** **PASS**
  - **Nhịp cảnh (`1 chính + 2 phụ`) & bản sắc Lạc Hồng Số:** Cảnh chính trung tâm nổi bật (nữ thanh niên kiên nhẫn chỉ tay hướng dẫn bác gái tự tin cầm điện thoại mỉm cười); 2 tiểu cảnh nền gọn gàng (trái: đoàn viên hỗ trợ bạn trẻ dùng laptop; phải: đoàn viên hỗ trợ tiểu thương nam áo nâu cam dùng điện thoại bên rổ trái cây); trống đồng Đông Sơn vàng nhạt + 3 chim Lạc góc trên phải hài hòa.
  - **Nhất quán nhân vật & giải phẫu:** Cả 4 nhân vật trong style sheet (nữ áo kem + túi navy, nam đoàn viên áo polo `#1464B4` trơn 0 huy hiệu giả, bác gái tóc búi hoa râm áo hoa văn xanh xám–kem dịu, tiểu thương nam áo nâu cam) đều giữ nguyên nhận diện. Ngón tay trỏ của nữ sinh và hai bàn tay giữ điện thoại của bác gái đều tự nhiên, đúng giải phẫu; các bàn tay ở hai tiểu cảnh phụ rõ ràng. **100% không chữ, không số, không logo/huy hiệu giả, không QR giả.**

---

### 04. `04_lhs_raw.png` — Ấn phẩm 04: LAN TỎA TRONG CỘNG ĐỒNG (*TỪ MỘT NGƯỜI ĐẾN CẢ CỘNG ĐỒNG*)

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ `0.7467`), RGB PNG (`1,490,128 bytes`).
- **Tọa độ thực tế các điểm neo quan trọng trong ảnh gốc (`896 × 1200`):**
  - Đàn 04 chim Lạc bay lên góc trên phải: `x = 540..861, y = 41..259` (cánh chim cao nhất tại `y = 41`, chim thấp nhất vươn về trái đến `x = 540`).
  - Vòng sóng lan tỏa & đỉnh trống đồng Đông Sơn: từ `y = 200` trở xuống.
  - Đỉnh đầu cao nhất (chị hàng xóm tiền cảnh `y = 410`; bác gái `y = 423`; các nhóm hậu cảnh nằm dưới `y = 440`) — hơn `34%` vùng trời trống phía trên.
  - Đáy sổ tay navy & dây đánh dấu đỏ trên bàn tiền cảnh: `y ≈ 1005`, bàn gỗ sạch kéo dài xuống `y = 1200`.
- **Tọa độ crop `4:5` (`1080 × 1350 px`) KHÔNG CẮT XÉN cho `editable/04.svg` (`lhs-compositor`):**
  - **Phương án chuẩn (Full-bleed non-clipping 4:5):** Crop **`(0, 18, 896, 1138)`** (`896 × 1120 px`) scale đồng dạng (`1.2054×`) thành **`1080 × 1350 px`**.
  - **Kiểm chứng vùng an toàn (`1080 × 1350`):**
    - Cả 04 chim Lạc giữ nguyên vẹn 100% tại `x = 651..1038, y = 28..290` → **khuyến nghị đặt khối tiêu đề/phụ đề canh trái gọn trong `x = 64..635` (hoặc `x = 168..635` bên cạnh huy hiệu `(64, 56)`, ngắt 2 dòng gọn và đặt vùng nội dung dưới `y = 165..430`)** để hoàn toàn không đụng cánh chim thấp nhất tại `x = 651`.
    - Đỉnh đầu cao nhất ở `y = 473` (`35.0%` chiều cao poster → rất rộng thoáng cho typography phía trên).
    - Đáy sổ tay navy dừng ở `y ≈ 1190`, chừa mặt bàn gỗ sạch `45–55 px` phía trên dải footer `#0D2B52` (`y = 1235..1350` hoặc `y = 1246..1350`).
- **Quy trình kiểm tra:** Đọc trực tiếp via `read_file` + crop zoom `3×` riêng hai cánh tay/bàn tay bác gái (`04_elderly_arms_zoom.png`), hai tay giữ phone của người hàng xóm (`04_neighbor_hands_zoom.png`), cận cảnh nhóm 3 bạn trẻ & cặp tiểu thương sạp trái cây (`04_bg_trio_pair.png`), thước đo pixel và giả lập `04_sim_crop_y18.png`.
- **Kết quả kiểm định:** **PASS**
  - **Kiểm tra giải phẫu 2 cánh tay bác gái (`[ART-05]`):** Zoom `3×` xác nhận rành mạch bác gái chỉ có **đúng 2 cánh tay & 2 bàn tay**: tay phải từ vai phải gập khuỷu đưa sang phải chỉ ngón trỏ hướng dẫn trên màn hình (bàn tay phải); tay trái từ vai trái phía sau thân đưa xuống đặt úp tự nhiên lên mặt bàn (đủ 5 ngón: ngón cái bên trái phía trong, 4 ngón tiếp theo rõ ràng). Người hàng xóm áo cam đất dùng đúng 2 tay đỡ điện thoại (5 ngón tay phải rõ).
  - **Nhất quán nhân vật đa nhóm & bản sắc Lạc Hồng Số:** Nhóm giữa hậu cảnh gồm nữ áo kem + túi navy cầm tablet trơn, nam đoàn viên áo `#1464B4` trơn 0 huy hiệu, bạn áo xanh rêu cầm sổ; nhóm sạp trái cây bên phải có tiểu thương áo nâu cam + hàng xóm áo rêu; các vòng tròn sóng kết nối lan tỏa hòa cùng trống đồng Đông Sơn và 4 chim Lạc bay lên. **100% không chữ, không số, không logo/huy hiệu giả, không QR giả.**

---

### 05. `05_lhs_raw.png` — Ấn phẩm 05: KHÁT VỌNG LẠC HỒNG SỐ (*HIỂU ĐÚNG – LÀM THẬT – LAN TỎA*)

- **Kích thước / Định dạng nguồn:** `896 × 1200 px` (tỷ lệ `0.7467`), RGB PNG (`1,109,869 bytes`).
- **Tọa độ thực tế các điểm neo quan trọng trong ảnh gốc (`896 × 1200`):**
  - Đàn **05 chim Lạc** bay chéo góc trên phải: `x = 480..862, y = 41..279` (chim cao nhất tại `y = 41`, chim thấp nhất vươn về trái đến `x = 480`).
  - Vòng tròn trống đồng Đông Sơn ánh vàng + đường vòng cung kết nối: từ `y = 250` trở xuống.
  - Đỉnh đầu cao nhất (nam đoàn viên đứng thứ hai từ trái): `y = 457` (`38.1%` chiều cao ảnh gốc → gần 40% không gian trời rộng thoáng phía trên).
  - Thành lan can đá phía trước: mép trên `y = 903..915` (`75.3%`), mép dưới `y = 971` (`80.9%`); **toàn bộ vùng sân đá kem bên dưới (`y = 971..1200`, ~19% đáy ảnh; hoặc dưới nhân vật từ `y = 903..1200`, ~24.8% đáy ảnh) hoàn toàn trống sạch.**
- **Tọa độ crop `4:5` (`1080 × 1350 px`) KHÔNG CẮT XÉN & vùng đặt thẻ QR thật (`editable/05.svg`):**
  - **Phương án chuẩn (Full-bleed non-clipping 4:5):** Crop **`(0, 18, 896, 1138)`** (`896 × 1120 px`) scale đồng dạng (`1.2054×`) thành **`1080 × 1350 px`**.
  - **Kiểm chứng vùng an toàn (`1080 × 1350`):**
    - **Vùng tiêu đề trên:** Cả 05 chim Lạc giữ nguyên vẹn 100% tại `x = 579..1039, y = 28..315` → đặt khối tiêu đề `HIỂU ĐÚNG – LÀM THẬT – LAN TỎA` & phụ đề gọn trong **`x = 64..575`** (hoặc `x = 168..575, y = 56..450`), hoàn toàn tránh cánh chim thấp nhất tại `x = 579`. Đỉnh đầu cao nhất nằm tại **`y = 529`** (`39.2%` chiều cao → gần 40% chiều cao trên rất thoáng).
    - **Vùng đặt thẻ QR + CTA & Footer:** Toàn bộ 4 nhân vật dừng gọn phía trên mép lan can đá tại `y = 1067` (`79.0%`). Vùng từ `y = 1067..1350` (`283 px` = `21.0%` chiều cao đáy) hoàn toàn không có người: đặt thẻ **CTA `QUÉT MÃ ĐỌC NGHỊ QUYẾT GỐC` + mã QR thật** gọn trong **`x = 64..620, y = 1078..1234`** (cao `156 px`, nằm hoàn toàn dưới tất cả 4 nhân vật và phía trên dải footer `#0D2B52` từ `y = 1246..1350` — hoặc thu rộng nếu cần sang phải tới `x = 1016` vẫn không che nhân vật nào).
    - *(Phương án phụ nếu muốn thẻ QR nằm hoàn toàn dưới vạch lan can đá `y = 1092`: đặt ảnh `crop(0, 0, 896, 1200)` scale `1008 × 1350` căn giữa `x = 36` trên nền `#F7F3E8`, đưa mép dưới lan can đá lên `y = 1092` để chừa `154 px` sân trống phía trên footer `y = 1246..1350`.)*
- **Quy trình kiểm tra:** Đọc trực tiếp via `read_file` + zoom cận cảnh 4 gương mặt, bàn tay ôm sổ & tay cầm/chạm điện thoại, phần sân đá dưới và giả lập khung `05_sim_crop_y18.png`.
- **Kết quả kiểm định:** **PASS**
  - **Nhất quán đủ cả 04 nhân vật style sheet & giải phẫu:**
    1. *Nữ thanh niên (trái):* Áo sơ mi kem xắn tay + túi chéo navy, tay phải ôm quyển sổ tay bìa navy có dây đánh dấu đỏ (5 ngón tự nhiên).
    2. *Nam đoàn viên (thứ hai từ trái):* Áo polo `#1464B4` trơn hoàn toàn (**0 huy hiệu/logo giả**), quần tối màu, hai cánh tay buông tự nhiên sau lan can.
    3. *Bác gái (~65 tuổi, thứ ba từ trái):* Tóc hoa râm búi gọn, áo bà ba hoa văn xanh xám–kem dịu, tay trái giữ smartphone sạch không chữ/UI giả và ngón trỏ phải chạm nhẹ tự tin (2 tay cân đối, đủ ngón).
    4. *Hàng xóm / tiểu thương (phải):* Áo thun nâu cam đất trơn, thần thái điềm đạm hướng về tương lai, hai tay xuôi tự nhiên.
  - **Bản sắc Lạc Hồng Số:** Họa tiết trống đồng Đông Sơn ánh vàng tinh tế kết hợp vòng cung lan tỏa, đô thị xanh hai bên và 5 chim Lạc vút bay tạo cái kết giàu cảm hứng mà không khoa trương/sến. **100% không chữ, không số, không logo/huy hiệu giả, không QR giả.**

---

## 3. Bảng tổng hợp kiểm định liên hoàn

| Tệp | Vai trò / Cảnh | Kích thước gốc | Crop / Đặt khung `4:5` (`1080×1350`) | Nhất quán nhân vật & giải phẫu | Sạch chữ / logo / QR giả | Vùng an toàn `4:5` | Kết luận |
|---|---|---|---|---|---|---|---|
| `character-style-sheet-lhs.png` | Bảng tham chiếu gốc | `1376 × 768` | Tham chiếu gốc | Đạt cả 4 nhân vật + 2 đạo cụ | Đạt (0 chữ/logo/QR) | Nền `#F7F3E8` sạch | **PASS** |
| `01_lhs_raw.png` | `01` — KHỞI NGUỒN NHẬN THỨC | `896 × 1200` | Crop `(0,0,896,1178)` → `928×1220` tại `(76,14)` trên nền `#F7F3E8` | Nữ + nam đoàn viên khớp chuẩn + bạn kính; 6 tay đều 5 ngón | Đạt (0 chữ/logo/QR) | Đỉnh đầu `y=387`, chim `y=56..225`, sổ đáy `y=1204` trên footer `y≥1246` | **PASS** |
| `02_lhs_raw.png` | `02` — HIỂU ĐÚNG NỘI DUNG | `896 × 1200` | Crop `(0,210,896,1075)` → `950×917` tại `(65,300)` trên `#F8F2E6`/`#F7F3E8` | Cặp nam/nữ khớp tuyệt đối; 4 tay cân đối, đủ ngón | Đạt (0 chữ/logo/QR) | Vùng trên `y≤305` rộng trọn bề ngang, đáy bàn `y=1201` trước footer | **PASS** |
| `03_lhs_raw.png` | `03` — HÀNH ĐỘNG THIẾT THỰC | `896 × 1200` | Full-bleed crop `(0, 18, 896, 1138)` → `1080 × 1350` | Đủ cả 4 nhân vật style sheet; tay chỉ & tay cầm phone chuẩn xác | Đạt (0 chữ/logo/QR) | Chim `y=28..265`, đầu `y≥483` (>35% trên), sổ `y≤1190` trên footer `y≥1235` | **PASS** |
| `04_lhs_raw.png` | `04` — LAN TỎA TRONG CỘNG ĐỒNG | `896 × 1200` | Full-bleed crop `(0, 18, 896, 1138)` → `1080 × 1350` | Zoom `3×` xác nhận bác gái đúng 2 tay + các nhóm hậu cảnh chuẩn | Đạt (0 chữ/logo/QR) | 4 chim `x=651..1038, y=28..290` (tiêu đề gọn `x≤635`), đầu `y≥473`, sổ `y≤1190` | **PASS** |
| `05_lhs_raw.png` | `05` — KHÁT VỌNG LẠC HỒNG SỐ | `896 × 1200` | Full-bleed crop `(0, 18, 896, 1138)` → `1080 × 1350` | Đủ 4 nhân vật + sổ navy + phone; giải phẫu tay & mặt chuẩn | Đạt (0 chữ/logo/QR) | 5 chim `x=579..1039, y=28..315` (chữ `x≤575`), đầu `y≥529`, QR `y=1078..1234` dưới lan can `y=1067` | **PASS** |

---

## 4. Ghi chú điều phối công cụ & minh bạch AI

- **Phân công tạo sinh & kiểm định độc lập:** `@coordinator` điều phối `image-generator` tạo sinh tuần tự theo chuỗi tham chiếu (`character-style-sheet-lhs.png` → `01_lhs_raw.png` → `05_lhs_raw.png`); `@lhs-illustrator` kiểm định độc lập từng tệp ngay khi lưu bằng `read_file`, các crop zoom cận cảnh mặt/bàn tay/cánh tay (`2×–3×`), thước đo pixel và mô phỏng vùng an toàn `4:5` (`1080 × 1350 px`) trước khi chuyển giao tọa độ cho `@lhs-compositor`.
- **Bảo toàn nguyên bản nhận diện & văn bản gốc:** Mọi chữ tiếng Việt (`Be Vietnam Pro`), huy hiệu Đoàn Thanh niên Cộng sản Hồ Chí Minh nguyên bản (`deliverables/02_ThietKe/identity/derived/huy-hieu-doan-clean.png`), ghi chú nguồn Nghị quyết 57-NQ/TW và mã QR trỏ trực tiếp tới trang toàn văn trên `mst.gov.vn` được ghép hoàn toàn ở lớp vector `deliverables/02_ThietKe/editable/01.svg`..`05.svg`.
